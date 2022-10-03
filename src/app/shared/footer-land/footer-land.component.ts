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

    constructor(private http: HttpClient, public translate: TranslateService, public toastr: ToastrService, private modalService: NgbModal, private eventsService: EventsService) {
    }

    ngOnInit() {

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
          this.sending = true;
  
          //this.mainForm.value.email = (this.mainForm.value.email).toLowerCase();
          //this.mainForm.value.lang=this.translate.store.currentLang;
  
          var params = this.mainForm.value;
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

}
