// KVKK m.6: dietary answers can reveal health or religious data, so the guest gives a separate,
// explicit consent. The box starts unticked and the RSVP itself never depends on it.
window.LumaDietaryConsent = {
  consentText: 'Yazdığım beslenme tercihi ve alerji bilgisinin, sağlık veya dini inanç bilgisi içerebileceğini biliyorum. Bu bilginin yalnızca yemek planlaması amacıyla, bu etkinliğin sahibi ve ekibi tarafından görülmesine ve etkinlik sahibi etkinliği silene kadar saklanmasına açık rıza veriyorum. Rızamı, yanıtımı düzenleyip bu alanı silerek istediğim zaman geri alabilirim.',
  droppedText: 'Beslenme bilginiz onay verilmediği için kaydedilmedi. Yanıtınızın geri kalanı kaydedildi.',
  plannerNote: 'Bu bilgiyi yalnızca misafirin onayıyla girin.',
  fieldMarkup() {
    return `<div class="field full"><label for="rsvpDietary">BESLENME TERCİHİ VEYA ALERJİ (İSTEĞE BAĞLI)</label><textarea id="rsvpDietary" name="dietary_requirements" maxlength="1000" placeholder="Alerji, vejetaryen menü..."></textarea><small class="field-hint">Bu alanı doldurmak zorunda değilsiniz; katılım yanıtınız bundan etkilenmez.</small><label class="consent-check"><input type="checkbox" id="rsvpDietaryConsent" name="dietary_consent" value="yes"><span>${this.consentText} Ayrıntılar: <a href="/aydinlatma" target="_blank" rel="noopener">Aydınlatma Metni</a>.</span></label></div>`;
  },
  // Without consent the text is not sent at all; the server drops it as well.
  payload(text, consented) {
    const value = String(text || '').trim();
    const consent = Boolean(consented) && value !== '';
    return { dietary_requirements: consent ? value : '', dietary_consent: consent };
  },
  // Text the guest typed but did not consent to is reported back, so it is never silently lost.
  wasDropped(text, consented, receipt) {
    return Boolean(receipt?.dietary_dropped) || (String(text || '').trim() !== '' && !consented);
  }
};
