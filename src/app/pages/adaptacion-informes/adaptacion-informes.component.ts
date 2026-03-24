import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OpenAiService } from '../../shared/services/openAi.service';
import { TranslateService } from '@ngx-translate/core';
import * as marked from 'marked';
import Swal from 'sweetalert2';

interface ProcessingResult {
  success: boolean;
  message: string;
  originalText: string;
  anonymizedText: string;
  adaptedReport: string;
  tokenCount: number;
  generationTime: number;
}

@Component({
    standalone: false,
    selector: 'app-adaptacion-informes',
  templateUrl: './adaptacion-informes.component.html',
  styleUrls: ['./adaptacion-informes.component.scss']
})
export class AdaptacionInformesComponent implements OnInit, AfterViewInit {

  selectedFile = signal<File | null>(null);
  fileName = signal('');
  isLoading = signal(false);
  errorMessage = signal('');
  result = signal<ProcessingResult | null>(null);
  adaptedReportHtml = signal('');
  uploadProgress = signal(0);
  reportGenerated = signal(false);
  selectedReportType: string = 'ia_estandar';
  showNewReportButton = signal(false);
  isEditing = signal(false);
  editableContent = signal('');
  
  @ViewChild('editor', { static: false }) editorElement!: ElementRef;

  constructor(
    private http: HttpClient, 
    private openAiService: OpenAiService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    console.log('🚀 Adaptación de Informes Médicos iniciado');
  }

  ngAfterViewInit(): void {
    // El editor se inicializará cuando se necesite
  }

  // ========================
  // Manejo de archivos
  // ========================

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.validateFile(file);
    }
  }

  openFileSelector(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileDropped(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.validateFile(files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  validateFile(file: File): void {
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      this.errorMessage.set(this.translate.instant('adaptacion.error_file_type'));
      return;
    }

    if (file.size > maxSize) {
      this.errorMessage.set(this.translate.instant('adaptacion.error_file_size'));
      return;
    }

    this.selectedFile.set(file);
    this.fileName.set(file.name);
    this.errorMessage.set('');
    console.log('📁 Archivo seleccionado:', file.name, `(${file.size} bytes)`);
  }

  removeFile(): void {
    this.selectedFile.set(null);
    this.fileName.set('');
    this.errorMessage.set('');
    this.result.set(null);
    this.adaptedReportHtml.set('');
    this.uploadProgress.set(0);
    this.reportGenerated.set(false);
    this.showNewReportButton.set(false);
    this.isEditing.set(false);
    this.editableContent.set('');
  }

  private resetState(): void {
    this.removeFile();
    this.isLoading.set(false);
  }

  generateNewReport(): void {
    this.removeFile();
    // Scroll hacia arriba para mostrar la sección de upload
    const navbarHeight = 4.3 * 16; // 4.3rem en pixels
    window.scrollTo({ 
      top: -navbarHeight, 
      behavior: 'smooth' 
    });
  }


  // ========================
  // Procesamiento
  // ========================

  async processFile(): Promise<void> {
    const currentFile = this.selectedFile();
    if (!currentFile) {
      this.errorMessage.set(this.translate.instant('adaptacion.error_no_file'));
      return;
    }
    
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.result.set(null);
    this.uploadProgress.set(0);
    this.reportGenerated.set(false);
    
    // Iniciar simulación de progreso
    this.simulateUploadProgress();
    
    // Scroll hacia la sección de procesamiento con delay para que se renderice
    setTimeout(() => {
      const processingArea = document.getElementById('processing-area');
      if (processingArea) {
        const elementPosition = processingArea.getBoundingClientRect().top;
        const offsetPosition = elementPosition  - 20; // Margen extra
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // Fallback: scroll hacia arriba si no encuentra la sección
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 300); // Delay para dar tiempo a que se renderice
    try {
      console.log('🔄 Iniciando procesamiento...');
      
      const formData = new FormData();
      formData.append('file', currentFile);
      formData.append('reportType', this.selectedReportType);
      
      console.log('📁 Archivo a enviar:', currentFile);
      console.log('📁 Tipo de informe:', this.selectedReportType);
      console.log('📁 FormData:', formData);
      
      const response = await this.openAiService.postCallIaClaro(formData).toPromise();
      
      if (response && response.success) {
        this.result.set(response as ProcessingResult);
        // Convertir Markdown a HTML
        this.adaptedReportHtml.set(marked.parse(response.adaptedReport) as string);
        this.editableContent.set(response.adaptedReport); // Contenido original en markdown para editar
        this.reportGenerated.set(true);
        this.showNewReportButton.set(true);
        console.log('✅ Procesamiento completado exitosamente');
        
        // Mostrar mensaje de éxito
        Swal.fire({
          icon: 'success',
          title: this.translate.instant('adaptacion.success_title'),
          text: this.translate.instant('adaptacion.success_message'),
          timer: 2000,
          showConfirmButton: false
        });
        
        // Scroll automático hacia la sección de resultados
        setTimeout(() => {
          const resultsSection = document.getElementById('results-section');
          if (resultsSection) {
            const elementPosition = resultsSection.offsetTop;
            const offsetPosition = elementPosition - 30; // 20px extra de margen
            
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 100);
      } else {
        throw new Error(response?.message || this.translate.instant('adaptacion.error_unknown'));
      }
      
    } catch (error) {
      console.error('❌ Error en el procesamiento:', error);
      
      // Mostrar error con SweetAlert2
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('adaptacion.error_title'),
        text: this.translate.instant('adaptacion.error_generic'),
        confirmButtonText: this.translate.instant('adaptacion.try_again'),
        confirmButtonColor: '#dc3545'
      }).then(() => {
        // Resetear estado después de cerrar el modal
        this.resetState();
      });
    } finally {
      this.isLoading.set(false);
    }
  }

  // ========================
  // Descarga de resultados
  // ========================

  downloadReport(): void {
    const currentResult = this.result();
    if (!currentResult) return;

    try {
      // Crear una ventana nueva para imprimir
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        this.showErrorAlert(this.translate.instant('adaptacion.popup_blocked'));
        return;
      }

      // Convertir Markdown a HTML
      const htmlContent = marked.parse(currentResult.adaptedReport) as string;
      
      // Crear el contenido HTML para imprimir
      const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${this.translate.instant('adaptacion.pdf_title')}</title>
          <style>
            @media print {
              @page {
                margin: 2cm;
                size: A4;
              }
              body {
                font-family: Arial, sans-serif;
                font-size: 12px;
                line-height: 1.6;
                color: #333;
                max-width: 100%;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #007bff;
                padding-bottom: 15px;
              }
              .header h1 {
                color: #007bff;
                font-size: 24px;
                margin: 0;
              }
              .header p {
                color: #666;
                font-size: 14px;
                margin: 5px 0 0 0;
              }
              h1, h2, h3, h4, h5, h6 {
                color: #007bff;
                margin-top: 20px;
                margin-bottom: 10px;
              }
              h1 { font-size: 20px; }
              h2 { font-size: 18px; }
              h3 { font-size: 16px; }
              p { margin-bottom: 10px; }
              ul, ol { margin-bottom: 10px; padding-left: 20px; }
              li { margin-bottom: 5px; }
              strong, b { font-weight: bold; }
              em, i { font-style: italic; }
              .no-print { display: none; }
            }
            @media screen {
              body {
                font-family: Arial, sans-serif;
                font-size: 14px;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
                border-bottom: 2px solid #007bff;
                padding-bottom: 15px;
              }
              .header h1 {
                color: #007bff;
                font-size: 24px;
                margin: 0;
              }
              .header p {
                color: #666;
                font-size: 14px;
                margin: 5px 0 0 0;
              }
              .print-button {
                background: #007bff;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
                cursor: pointer;
                margin: 20px 0;
                font-size: 16px;
              }
              .print-button:hover {
                background: #0056b3;
              }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${this.translate.instant('adaptacion.pdf_title')}</h1>
            <p>${new Date().toLocaleDateString('es-ES', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</p>
          </div>
          
          <button class="print-button no-print" onclick="window.print()">
            ${this.translate.instant('adaptacion.print_pdf')}
          </button>
          
          <div class="content">
            ${htmlContent}
          </div>
          
          <script>
            // Auto-print en algunos navegadores
            setTimeout(() => {
              window.print();
            }, 500);
          </script>
        </body>
        </html>
      `;

      // Escribir el contenido en la nueva ventana
      printWindow.document.write(printContent);
      printWindow.document.close();

      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: this.translate.instant('adaptacion.pdf_success_title'),
        text: this.translate.instant('adaptacion.pdf_success_message'),
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Error generando PDF:', error);
      
      // Mostrar error
      Swal.fire({
        icon: 'error',
        title: this.translate.instant('adaptacion.pdf_error_title'),
        text: this.translate.instant('adaptacion.pdf_error_message'),
        confirmButtonText: this.translate.instant('adaptacion.ok')
      });
    }
  }

  // ========================
  // Simulación de progreso
  // ========================

  private simulateUploadProgress(): void {
    const interval = setInterval(() => {
      if (this.uploadProgress() < 90) {
        this.uploadProgress.set(this.uploadProgress() + Math.random() * 10);
      } else if (this.reportGenerated()) {
        this.uploadProgress.set(100);
        clearInterval(interval);
      }
    }, 1500);
  }

  // ========================
  // Editor WYSIWYG Simple
  // ========================

  toggleEdit(): void {
    if (!this.isEditing()) {
      this.isEditing.set(true);
      this.editableContent.set(this.result()?.adaptedReport || '');
      
      // Inicializar editor después de que la vista se actualice
      setTimeout(() => {
        if (this.editorElement) {
          // Convertir Markdown a HTML para mostrar en el editor
          const htmlContent = marked.parse(this.editableContent()) as string;
          this.editorElement.nativeElement.innerHTML = htmlContent;
        }
      }, 100);
    } else {
      this.isEditing.set(false);
    }
  }

  saveEdits(): void {
    const currentResult = this.result();
    if (this.editorElement && currentResult) {
      // Obtener contenido HTML del editor
      this.editableContent.set(this.editorElement.nativeElement.innerHTML);
      
      // Actualizar el resultado con el contenido editado
      this.result.set({
        ...currentResult,
        adaptedReport: this.editableContent()
      });
      
      // Convertir a HTML para mostrar
      this.adaptedReportHtml.set(this.editableContent());
      
      this.isEditing.set(false);
      
      // Mostrar mensaje de éxito
      Swal.fire({
        icon: 'success',
        title: this.translate.instant('adaptacion.save_success_title'),
        text: this.translate.instant('adaptacion.save_success_message'),
        timer: 2000,
        showConfirmButton: false
      });
    }
  }

  cancelEdit(): void {
    // Restaurar el contenido original (Markdown) y volver a renderizar a HTML
    this.editableContent.set(this.result()?.adaptedReport || '');
    this.adaptedReportHtml.set(marked.parse(this.editableContent()) as string);
    this.isEditing.set(false);
  }

  // Métodos para la barra de herramientas del editor
  formatText(command: string, value?: string): void {
    document.execCommand(command, false, value);
    this.editorElement.nativeElement.focus();
  }

  insertList(type: 'ordered' | 'unordered'): void {
    if (type === 'ordered') {
      document.execCommand('insertOrderedList', false);
    } else {
      document.execCommand('insertUnorderedList', false);
    }
    this.editorElement.nativeElement.focus();
  }

  insertHeading(level: number): void {
    document.execCommand('formatBlock', false, `h${level}`);
    this.editorElement.nativeElement.focus();
  }

  // ========================
  // Métodos de utilidad
  // ========================

  private showErrorAlert(message: string): void {
    Swal.fire({
      icon: 'error',
      title: this.translate.instant('adaptacion.error_title'),
      text: message,
      confirmButtonText: this.translate.instant('adaptacion.ok')
    });
  }
}
