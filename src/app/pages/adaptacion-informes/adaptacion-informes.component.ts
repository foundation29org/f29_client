import { Component, OnInit } from '@angular/core';
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
  selector: 'app-adaptacion-informes',
  templateUrl: './adaptacion-informes.component.html',
  styleUrls: ['./adaptacion-informes.component.scss']
})
export class AdaptacionInformesComponent implements OnInit {

  selectedFile: File | null = null;
  fileName: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';
  result: ProcessingResult | null = null;
  adaptedReportHtml: string = '';
  uploadProgress: number = 0;
  reportGenerated: boolean = false;
  selectedReportType: string = 'ia_estandar';
  showNewReportButton: boolean = false;
  isEditing: boolean = false;
  editableContent: string = '';

  constructor(
    private http: HttpClient, 
    private openAiService: OpenAiService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    console.log('🚀 Adaptación de Informes Médicos iniciado');
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
      this.errorMessage = this.translate.instant('adaptacion.error_file_type');
      return;
    }

    if (file.size > maxSize) {
      this.errorMessage = this.translate.instant('adaptacion.error_file_size');
      return;
    }

    this.selectedFile = file;
    this.fileName = file.name;
    this.errorMessage = '';
    console.log('📁 Archivo seleccionado:', file.name, `(${file.size} bytes)`);
  }

  removeFile(): void {
    this.selectedFile = null;
    this.fileName = '';
    this.errorMessage = '';
    this.result = null;
    this.adaptedReportHtml = '';
    this.uploadProgress = 0;
    this.reportGenerated = false;
    this.showNewReportButton = false;
    this.isEditing = false;
    this.editableContent = '';
  }

  private resetState(): void {
    this.removeFile();
    this.isLoading = false;
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
  // Edición de contenido
  // ========================

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      // Al entrar en modo edición, usar el contenido markdown original
      this.editableContent = this.result?.adaptedReport || '';
    } else {
      // Al salir del modo edición, convertir a HTML
      this.adaptedReportHtml = marked.parse(this.editableContent) as string;
    }
  }

  saveEdits(): void {
    // Convertir el contenido editado a HTML
    this.adaptedReportHtml = marked.parse(this.editableContent) as string;
    this.result.adaptedReport = this.editableContent;
    this.isEditing = false;
  }

  cancelEdit(): void {
    // Restaurar el contenido original
    this.editableContent = this.result?.adaptedReport || '';
    this.isEditing = false;
  }

  // ========================
  // Procesamiento
  // ========================

  async processFile(): Promise<void> {
    if (!this.selectedFile) {
      this.errorMessage = this.translate.instant('adaptacion.error_no_file');
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    this.result = null;
    this.uploadProgress = 0;
    this.reportGenerated = false;
    
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
      formData.append('file', this.selectedFile);
      formData.append('reportType', this.selectedReportType);
      
      console.log('📁 Archivo a enviar:', this.selectedFile);
      console.log('📁 Tipo de informe:', this.selectedReportType);
      console.log('📁 FormData:', formData);
      
      const response = await this.openAiService.postCallIaClaro(formData).toPromise();
      
      if (response && response.success) {
        this.result = response;
        // Convertir Markdown a HTML
        this.adaptedReportHtml = marked.parse(response.adaptedReport) as string;
        this.editableContent = response.adaptedReport; // Contenido original en markdown para editar
        this.reportGenerated = true;
        this.showNewReportButton = true;
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
      this.isLoading = false;
    }
  }

  // ========================
  // Descarga de resultados
  // ========================

  downloadReport(): void {
    if (!this.result) return;

    const blob = new Blob([this.result.adaptedReport], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `informe_adaptado_${new Date().getTime()}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  // ========================
  // Simulación de progreso
  // ========================

  private simulateUploadProgress(): void {
    const interval = setInterval(() => {
      if (this.uploadProgress < 90) {
        this.uploadProgress += Math.random() * 10;
      } else if (this.reportGenerated) {
        this.uploadProgress = 100;
        clearInterval(interval);
      }
    }, 1500);
  }
}
