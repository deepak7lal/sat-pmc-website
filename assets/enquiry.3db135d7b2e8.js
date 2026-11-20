/* The HTML action remains a working Formspree submission when JavaScript is unavailable. */
(()=>{
  'use strict';
  const form=document.getElementById('enquiry-form');
  if(!form||!window.fetch||!window.FormData)return;
  const submit=form.querySelector('button[type="submit"]');
  const feedback=document.getElementById('form-feedback');
  const recovery=document.getElementById('form-recovery');
  const verify=document.getElementById('form-verify');
  const controls=[...form.querySelectorAll('input,select,textarea,button[type="submit"]')];
  const buttonMarkup=submit.innerHTML;
  let submitting=false;

  function showFeedback(message,state){
    feedback.textContent=message;
    feedback.dataset.state=state;
    feedback.setAttribute('role',state==='error'?'alert':'status');
    feedback.setAttribute('aria-live',state==='error'?'assertive':'polite');
    feedback.hidden=false;
    recovery.hidden=state!=='error';
  }
  function clearFeedback(){
    feedback.hidden=true;feedback.textContent='';delete feedback.dataset.state;
    recovery.hidden=true;verify.hidden=true;
  }
  form.addEventListener('input',event=>{
    if(event.target.setCustomValidity)event.target.setCustomValidity('');
    if(feedback.dataset.state==='success')clearFeedback();
  });
  verify.addEventListener('click',()=>{
    if(submitting||!form.reportValidity())return;
    HTMLFormElement.prototype.submit.call(form);
  });

  form.addEventListener('submit',async event=>{
    event.preventDefault();
    if(submitting)return;
    clearFeedback();
    for(const name of ['name','email','message']){
      const field=form.elements.namedItem(name);
      field.value=field.value.trim();
      if(!field.value)field.setCustomValidity('Please complete this field.');
    }
    if(!form.reportValidity())return;
    const data=new FormData(form);
    if(data.get('_gotcha')){
      showFeedback('We couldn’t submit your enquiry. Please contact us directly.','error');return;
    }
    data.set('_subject','New project enquiry — SAT PMC — '+data.get('service'));
    submitting=true;
    const disabledStates=controls.map(control=>control.disabled);
    controls.forEach(control=>{control.disabled=true;});
    form.setAttribute('aria-busy','true');
    submit.innerHTML='Sending… <span aria-hidden="true">↗</span>';
    showFeedback('Sending your enquiry…','sending');
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),20000);
    try{
      const response=await fetch(form.action,{method:'POST',body:data,headers:{Accept:'application/json'},credentials:'omit',signal:controller.signal});
      const result=await response.json().catch(()=>null);
      if(response.ok&&result&&result.ok===true){
        form.reset();
        showFeedback('Thank you. Your enquiry has been submitted successfully.','success');
      }else{
        const providerErrors=JSON.stringify(result||{});
        if(/captcha|verification/i.test(providerErrors)){
          showFeedback('Please complete verification to send your enquiry.','error');
          verify.hidden=false;
        }else if(response.status===429){
          showFeedback('The enquiry service is busy. Please wait and try again, or email our team directly.','error');
        }else{
          showFeedback('We couldn’t submit your enquiry. Your details are still here—please try again or email our team directly.','error');
        }
      }
    }catch(error){
      showFeedback(error.name==='AbortError'?'We couldn’t confirm submission in time. Your details have been kept. You can try again or contact our team directly.':'We couldn’t connect to the enquiry service. Your details have been kept. Please try again or email our team directly.','error');
    }finally{
      clearTimeout(timeout);
      controls.forEach((control,index)=>{control.disabled=disabledStates[index];});
      submitting=false;form.setAttribute('aria-busy','false');submit.innerHTML=buttonMarkup;
      feedback.focus({preventScroll:true});
    }
  });
})();
