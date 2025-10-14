import { Component} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';
import { OpenAiService } from 'app/shared/services/openAi.service';
import { EventsService } from 'app/shared/services/events.service';

@Component({
    selector: 'app-libro-page',
    templateUrl: './libro-page.component.html',
    styleUrls: ['./libro-page.component.scss'],
    providers: [OpenAiService]
})

export class LibroPageComponent {

    sending: boolean = false;
    private subscription: Subscription = new Subscription();
    query: string = '';
    queryCopy: string = '';
    responseLangchain: string = '';
    searchopenai: boolean = false;
    isComplexSearch: boolean = false;
    questions: any = [];
    lang = 'en';

    constructor(public translate: TranslateService, public toastr: ToastrService, private openAiService: OpenAiService, private eventsService: EventsService) {
        this.lang = sessionStorage.getItem('lang');;
        
    }

    ngOnInit() {
        this.eventsService.on('changelang', function (lang) {
            if (lang != this.lang) {
              this.lang = lang;
              this.getQuestions();
            }
          }.bind(this));
          this.getQuestions();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    async getQuestions(){
        await this.delay(200);
        this.questions = [
            { value: this.translate.instant("book.sugg1")},
            { value: this.translate.instant("book.sugg2")},
            { value: this.translate.instant("book.sugg3")}
          ]
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
        this.sending = true;
        this.searchopenai = false;
        let query = { 
          "question": this.query, "isComplexSearch": this.isComplexSearch, lang: this.lang
       };
        this.responseLangchain = '';
        this.subscription.add(this.openAiService.postOpenAi3(query)
          .subscribe((res: any) => {
            console.log(res)
            if(res.data.indexOf("I don't know") !=-1 || res.data.indexOf("No sé") !=-1 ) {
              this.searchopenai = true;
              let value = { value: this.query, isComplexSearch: this.isComplexSearch };
              this.subscription.add(this.openAiService.postOpenAi(value)
                .subscribe((res: any) => {
                  this.queryCopy = this.query;
                  this.query = '';
                  this.responseLangchain = res.choices[0].message.content;
                  const regex = /^```html\n|\n```$/g;
                  this.responseLangchain = this.responseLangchain.replace(regex, '');
                  this.responseLangchain = this.responseLangchain.replace(/【.*?】/g, "");
                  this.sending = false;
                  this.scrollTo();
                }, (err) => {
                  this.sending = false;
                  console.log(err);
                  this.toastr.error('', this.translate.instant("generics.error try again"));
    
                }));
            } else {
              this.sending = false;
              console.log('entra')
              this.queryCopy = this.query;
              this.query = '';
              this.responseLangchain = res.data;
              const regex = /^```html\n|\n```$/g;
              this.responseLangchain = this.responseLangchain.replace(regex, '');
              this.responseLangchain = this.responseLangchain.replace(/【.*?】/g, "");
              console.log(this.sending)
              this.scrollTo();
              
            }
    
          }, (err) => {
            this.sending = false;
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
