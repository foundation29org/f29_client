import { TranslateService } from '@ngx-translate/core';
import { Component, ViewChild, OnDestroy, OnInit, effect, signal } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { NgForm } from '@angular/forms';
import { environment } from 'environments/environment';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { EventsService } from 'app/shared/services/events.service';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
    standalone: false,
    selector: 'app-footer-land',
    templateUrl: './footer-land.component.html',
    styleUrls: ['./footer-land.component.scss']
})

export class FooterLandComponent implements OnDestroy, OnInit{
    //Variables
    currentDate : Date = new Date();
    _startTime: any;
    @ViewChild('f') mainForm: NgForm;
    sending = signal(false);
    email: string;
    modalReference: NgbModalRef;
    lang: string = 'en';
    iconmoh: string = 'assets/img/land/logos/MoH_en.png';
    iconjsd: string = 'assets/img/land/logos/sjd_en.png';
    private subscription: Subscription = new Subscription();
    
    // reCAPTCHA v3
    private recaptchaLoaded: boolean = false;
    private readonly RECAPTCHA_SITE_KEY = '6Ld1iuIrAAAAAGHj_7jy-W3_c0DIhivNfF_74FzL';
    
    // Variable estática para evitar cargas múltiples
    private static recaptchaScriptLoaded: boolean = false;
    private static recaptchaLoadPromise: Promise<void> | null = null;

    constructor(private http: HttpClient, public translate: TranslateService, public toastr: ToastrService, private modalService: NgbModal, private eventsService: EventsService) {
      effect(() => {
        const lang = this.eventsService.currentLanguage();
        this.lang = lang;
        if (this.lang == 'uk') {
          this.iconmoh = 'assets/img/land/logos/MoH_uk.png';
        } else {
          this.iconmoh = 'assets/img/land/logos/MoH_en.png';
        }
        if (this.lang == 'es') {
          this.iconjsd = 'assets/img/land/logos/sjd_es.png';
        } else {
          this.iconjsd = 'assets/img/land/logos/sjd_en.png';
        }
      });
    }

    ngOnInit() {
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
          void this.executeRecaptcha();
      }

      private async executeRecaptcha(): Promise<void> {
          try {
              await this.loadRecaptcha();
          } catch (error) {
              this.toastr.error('', 'reCAPTCHA no se ha cargado correctamente');
              return;
          }

          // Verificar que grecaptcha esté disponible
          if (typeof (window as any).grecaptcha === 'undefined') {
              this.toastr.error('', 'reCAPTCHA no está disponible');
              return;
          }

          (window as any).grecaptcha.ready(() => {
              (window as any).grecaptcha.execute(this.RECAPTCHA_SITE_KEY, { action: 'submit' })
                  .then((token: string) => {
                      this.submitForm(token);
                  })
                  .catch((error: any) => {
                      this.toastr.error('', 'Error en la verificación de seguridad');
                  });
          });
      }

      private submitForm(recaptchaToken: string): void {
          this.sending.set(true);
  
          var params = {
              ...this.mainForm.value,
              recaptchaToken: recaptchaToken
          };
          
          this.subscription.add( this.http.post(environment.api+'/api/homesupport/', params)
          .subscribe( (res : any) => {
            this.sending.set(false);
            this.toastr.success('', this.translate.instant("generics.Data saved successfully"));
            this.mainForm.reset();
           }, (err) => {
             console.log(err);
             this.sending.set(false);
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
        this.modalService.dismissAll();
        let ngbModalOptions: NgbModalOptions = {
            keyboard: true,
            container: 'body',
            scrollable: true,
            windowClass: 'ModalClass-sm legal-modal-window',// xl, lg, sm
            backdropClass: 'legal-modal-backdrop'
        };
        this.modalReference = this.modalService.open(panel, ngbModalOptions);
    }

      closeModal() {
          if (this.modalReference != undefined) {
              this.modalReference.close()
          }
      }

      private loadRecaptcha(): Promise<void> {
          if (this.recaptchaLoaded && typeof (window as any).grecaptcha !== 'undefined') {
              return Promise.resolve();
          }

          if (FooterLandComponent.recaptchaLoadPromise) {
              return FooterLandComponent.recaptchaLoadPromise.then(() => {
                  this.recaptchaLoaded = true;
              });
          }

          FooterLandComponent.recaptchaLoadPromise = new Promise<void>((resolve, reject) => {
              const resolveWhenReady = () => {
                  if (typeof (window as any).grecaptcha !== 'undefined') {
                      FooterLandComponent.recaptchaScriptLoaded = true;
                      this.recaptchaLoaded = true;
                      resolve();
                      return;
                  }
                  reject(new Error('grecaptcha is not available'));
              };

              const existingScript = document.querySelector(`script[src*="recaptcha/api.js"]`) as HTMLScriptElement | null;
              if (existingScript) {
                  if (FooterLandComponent.recaptchaScriptLoaded || typeof (window as any).grecaptcha !== 'undefined') {
                      resolveWhenReady();
                      return;
                  }

                  existingScript.addEventListener('load', resolveWhenReady, { once: true });
                  existingScript.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA script')), { once: true });
                  return;
              }

              const script = document.createElement('script');
              script.src = `https://www.google.com/recaptcha/api.js?render=${this.RECAPTCHA_SITE_KEY}`;
              script.async = true;
              script.defer = true;
              script.addEventListener('load', resolveWhenReady, { once: true });
              script.addEventListener('error', () => reject(new Error('Failed to load reCAPTCHA script')), { once: true });
              document.head.appendChild(script);
          }).catch((error) => {
              FooterLandComponent.recaptchaLoadPromise = null;
              throw error;
          });

          return FooterLandComponent.recaptchaLoadPromise;
      }

}
