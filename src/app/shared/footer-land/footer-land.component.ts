import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChild, OnDestroy, OnInit } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs/Subscription';
import { ToastrService } from 'ngx-toastr';
import { EventsService } from 'app/shared/services/events.service';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-footer-land',
    templateUrl: './footer-land.component.html',
    styleUrls: ['./footer-land.component.scss']
})

export class FooterLandComponent implements OnDestroy, OnInit{
    //Variables
    currentDate : Date = new Date();
    _startTime: any;
    @ViewChild('f') mainForm: NgForm;
    sending: boolean = false;
    email: string;
    modalReference: NgbModalRef;
    lang: string = 'en';
    private subscription: Subscription = new Subscription();
    
    // reCAPTCHA v3
    private recaptchaLoaded: boolean = false;
    private readonly RECAPTCHA_SITE_KEY = '6Ld1iuIrAAAAAGHj_7jy-W3_c0DIhivNfF_74FzL';
    
    // Variable estática para evitar cargas múltiples
    private static recaptchaScriptLoaded: boolean = false;

    constructor(private http: HttpClient, public translate: TranslateService, public toastr: ToastrService, private modalService: NgbModal, private eventsService: EventsService) {
    }

    ngOnInit() {
      this.loadRecaptcha();

      this.eventsService.on('changelang', function (lang) {
          this.lang = lang;
          if (this.lang == 'uk') {
              this.iconmoh = 'assets/img/land/logos/MoH_uk.png';
          }else{
              this.iconmoh = 'assets/img/land/logos/MoH_en.png';
          }
          if (this.lang == 'es') {
              this.iconjsd = 'assets/img/land/logos/sjd_es.png';
          } else {
              this.iconjsd = 'assets/img/land/logos/sjd_en.png';
          }
      }.bind(this));

  }

      ngOnDestroy() {
        this.subscription.unsubscribe();
      }
      
      submitInvalidForm() {
        if (!this.mainForm) { return; }
        const base = this.mainForm;
        for (const field in base.form.controls) {
          if (!base.form.controls[field].valid) {
              base.form.controls[field].markAsTouched()
          }
        }
      }
  
      sendMsg(){
          // Ejecutar reCAPTCHA v3
          this.executeRecaptcha();
      }

      private executeRecaptcha(): void {
          if (!this.recaptchaLoaded) {
              console.error('reCAPTCHA not loaded');
              this.toastr.error('', 'reCAPTCHA no se ha cargado correctamente');
              return;
          }

          console.log('Executing reCAPTCHA with site key:', this.RECAPTCHA_SITE_KEY);

          // Verificar que grecaptcha esté disponible
          if (typeof (window as any).grecaptcha === 'undefined') {
              console.error('grecaptcha is not defined');
              this.toastr.error('', 'reCAPTCHA no está disponible');
              return;
          }

          (window as any).grecaptcha.ready(() => {
              console.log('grecaptcha is ready');
              
              (window as any).grecaptcha.execute(this.RECAPTCHA_SITE_KEY, { action: 'submit' })
                  .then((token: string) => {
                      console.log('reCAPTCHA token generated:', token.substring(0, 20) + '...');
                      this.submitForm(token);
                  })
                  .catch((error: any) => {
                      console.error('reCAPTCHA error:', error);
                      this.toastr.error('', 'Error en la verificación de seguridad');
                  });
          });
      }

      private submitForm(recaptchaToken: string): void {
          this.sending = true;
  
          var params = {
              ...this.mainForm.value,
              recaptchaToken: recaptchaToken
          };
          
          this.subscription.add( this.http.post(environment.api+'/api/homesupport/', params)
          .subscribe( (res : any) => {
            this.sending = false;
            this.toastr.success('', this.translate.instant("generics.Data saved successfully"));
            this.mainForm.reset();
           }, (err) => {
             console.log(err);
             this.sending = false;
             this.toastr.error('', this.translate.instant("generics.error try again"));
           }));
      }

      openWeb() {
        if (this.lang == 'es') {
            window.open('https://www.foundation29.org', '_blank');
        } else {
            window.open('https://www.foundation29.org/en/', '_blank');
        }
    }

    openModal(panel) {
        let ngbModalOptions: NgbModalOptions = {
            keyboard: true,
            windowClass: 'ModalClass-sm'// xl, lg, sm
        };
        this.modalReference = this.modalService.open(panel, ngbModalOptions);
    }

      closeModal() {
          if (this.modalReference != undefined) {
              this.modalReference.close()
          }
      }

      private loadRecaptcha(): void {
          // Verificar si ya está cargado globalmente
          if (FooterLandComponent.recaptchaScriptLoaded) {
              this.recaptchaLoaded = true;
              return;
          }

          // Verificar si ya existe el script
          if (document.querySelector(`script[src*="recaptcha/api.js"]`)) {
              FooterLandComponent.recaptchaScriptLoaded = true;
              this.recaptchaLoaded = true;
              return;
          }

          console.log('Loading reCAPTCHA with site key:', this.RECAPTCHA_SITE_KEY);

          // Crear script de reCAPTCHA según la documentación oficial
          const script = document.createElement('script');
          script.src = `https://www.google.com/recaptcha/api.js?render=${this.RECAPTCHA_SITE_KEY}`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
              FooterLandComponent.recaptchaScriptLoaded = true;
              this.recaptchaLoaded = true;
              console.log('reCAPTCHA v3 loaded successfully');
              
              // Verificar que grecaptcha esté disponible
              if (typeof (window as any).grecaptcha !== 'undefined') {
                  console.log('grecaptcha object is available');
              } else {
                  console.error('grecaptcha object is not available');
              }
          };
          
          script.onerror = () => {
              console.error('Failed to load reCAPTCHA v3');
          };
          
          document.head.appendChild(script);
      }

}
