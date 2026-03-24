import { Component, effect, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { OpenAiService } from 'app/shared/services/openAi.service';
import { EventsService } from 'app/shared/services/events.service';

@Component({
    standalone: false,
    selector: 'app-guia-page',
    templateUrl: './guia-page.component.html',
    styleUrls: ['./guia-page.component.scss'],
    providers: [OpenAiService]
})

export class GuiaPageComponent {

    sending = signal(false);
    private subscription: Subscription = new Subscription();
    query: string = '';
    queryCopy = signal('');
    responseLangchain = signal('');
    searchopenai = signal(false);
    isComplexSearch: boolean = false;
    questions = signal<any[]>([]);
    lang = 'en';

    constructor(public translate: TranslateService, public toastr: ToastrService, private openAiService: OpenAiService, private eventsService: EventsService) {
        this.lang = this.eventsService.currentLanguage();
        effect(() => {
          const lang = this.eventsService.currentLanguage();
          if (lang != this.lang) {
            this.lang = lang;
            this.getQuestions();
          }
        });
        
    }

    ngOnInit() {
          this.getQuestions();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    async getQuestions(){
        await this.delay(200);
        this.questions.set([
            { value: this.translate.instant("guia.sugg1")},
            { value: this.translate.instant("guia.sugg2")},
            { value: this.translate.instant("guia.sugg3")},
            { value: this.translate.instant("guia.sugg4")},
            { value: this.translate.instant("guia.sugg5")},
            { value: this.translate.instant("guia.sugg6")}
          ]);
    }

    selectSuggestion(question) {
        var tempComplex = this.isComplexSearch
        this.query = question.value;
        this.isComplexSearch = true;
        this.search();
        this.isComplexSearch = tempComplex;
      }
    
      search() {
        if(this.query == '') {
          this.toastr.error('', this.translate.instant("book.Write a question to search"));
          return;
        };
        console.log(this.query)
        console.log(this.isComplexSearch)
        this.sending.set(true);
        this.searchopenai.set(false);
        let query = { 
          "question": this.query, "isComplexSearch": this.isComplexSearch, lang: this.lang
       };
        this.responseLangchain.set('');
        this.subscription.add(this.openAiService.postCallGuia(query)
          .subscribe((res: any) => {
            console.log(res)
            if(res.data.indexOf("I don't know") !=-1 || res.data.indexOf("No sé") !=-1 ) {
              this.searchopenai.set(true);
              let value = { value: this.query, isComplexSearch: this.isComplexSearch };
              this.subscription.add(this.openAiService.postOpenAi(value)
                .subscribe((res: any) => {
                  this.queryCopy.set(this.query);
                  this.query = '';
                  let response = res.choices[0].message.content || '';
                  const regex = /^```html\n|\n```$/g;
                  response = response.replace(regex, '');
                  response = response.replace(/【.*?】/g, "");
                  this.responseLangchain.set(response);
                  this.sending.set(false);
                  this.scrollTo();
                }, (err) => {
                  this.sending.set(false);
                  console.log(err);
                  this.toastr.error('', this.translate.instant("generics.error try again"));
    
                }));
            } else {
              this.sending.set(false);
              console.log('entra')
              this.queryCopy.set(this.query);
              this.query = '';
              let response = res.data || '';
              const regex = /^```html\n|\n```$/g;
              response = response.replace(regex, '');
              response = response.replace(/【.*?】/g, "");

              const regex2 = /<a href="([^"]+)"(?!.*target="_blank")>/g;
              response = response.replace(regex2, '<a href="$1" target="_blank">');
              this.responseLangchain.set(response);
              console.log(this.sending())
              this.scrollTo();
              
            }
    
          }, (err) => {
            this.sending.set(false);
            console.log(err);
            this.toastr.error('', this.translate.instant("generics.error try again"));
          }));
    
      }
    
    async scrollTo() {
      await this.delay(200);
      const element = document.getElementById('initcontentIntro');
      if (element) {
        const elementPosition = element.offsetTop;
        const offsetPosition = elementPosition  - 30; // 20px extra de margen
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
    
    delay(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }
    
}
