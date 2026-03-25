import { Component, OnDestroy, effect } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from 'app/shared/services/events.service';
import { Subscription } from 'rxjs';

export type ToolCategory = 'all' | 'diagnosis' | 'data' | 'research' | 'information' | 'humanitarian';

export interface Tool {
  id: string;
  key: string;
  name: string;
  category: Exclude<ToolCategory, 'all'>;
  tagline: string;
  description: string;
  url?: string;
  routerLink?: string;
  newTab?: boolean;
  status: 'live' | 'dev' | 'archived' | 'restricted';
}

@Component({
  standalone: false,
  selector: 'app-tools-page',
  templateUrl: './tools-page.component.html',
  styleUrls: ['./tools-page.component.scss']
})
export class ToolsPageComponent implements OnDestroy {

  private subscription: Subscription = new Subscription();
  lang = 'en';
  activeFilter: ToolCategory = 'all';

  filters: { key: ToolCategory; label: string; count: number }[] = [];

  readonly tools: Tool[] = [
    // ── TOP 3 — FLAGSHIP ────────────────────────────────────────────
    {
      id: '01', key: 'dxgpt', name: 'DxGPT', category: 'diagnosis',
      tagline: 'AI-powered diagnostic decision support',
      description: 'Helps doctors and patients identify possible rare-disease diagnoses by describing symptoms in plain language. Powered by GPT-4, used 1,500+ times daily worldwide.',
      url: 'https://dxgpt.app/', status: 'live'
    },
    {
      id: '02', key: 'trialgpt', name: 'TrialGPT', category: 'research',
      tagline: 'AI matching for clinical trials',
      description: 'Analyzes medical reports and matches patients with relevant clinical trials worldwide, breaking down the barriers to trial access.',
      url: 'https://trialgpt.app/', status: 'live'
    },
    {
      id: '03', key: 'nav29', name: 'Nav29', category: 'data',
      tagline: 'Take control of your medical data',
      description: 'Free personalized health assistant: secure medical data storage, smart summaries, and intelligent navigation of your health journey.',
      url: 'https://nav29.org/', status: 'live'
    },
    // ── PATIENT INFORMATION TOOLS (open in new tab) ─────────────────
    {
      id: '04', key: 'rare_diseases_book', name: 'Rare Diseases Book', category: 'information',
      tagline: 'Comprehensive rare disease guide',
      description: 'An accessible, in-depth reference covering hundreds of rare diseases — for patients, families, and clinicians navigating undiagnosed conditions.',
      routerLink: '/libroenfermedadesraras', newTab: true, status: 'live'
    },
    {
      id: '05', key: 'rare_diseases_protocol', name: 'Rare Diseases Protocol', category: 'information',
      tagline: 'Clinical protocols made accessible',
      description: 'Complete clinical protocols and recommendations for rare disease management, adapted for patient and caregiver understanding.',
      routerLink: '/guiaenfermedadesraras', newTab: true, status: 'live'
    },
    {
      id: '06', key: 'medical_reports', name: 'Medical Reports', category: 'information',
      tagline: 'Reports patients can understand',
      description: 'Transforms complex medical reports into clear language that patients can actually read and understand, using AI-powered simplification.',
      routerLink: '/adaptacion-informes', newTab: true, status: 'live'
    },
    // ── RESEARCH ────────────────────────────────────────────────────
    {
      id: '07', key: 'collaborare', name: 'Collaborare', category: 'research',
      tagline: 'Patient experience data for EMA',
      description: 'AI project to systematically collect patient experience data in collaboration with the European Medicines Agency (EMA) and EURORDIS.',
      url: 'https://collaborare.app/', status: 'live'
    },
    {
      id: '08', key: 'healthdata29', name: 'HealthData 29', category: 'research',
      tagline: 'Open health datasets for research',
      description: 'Platform enabling health providers and institutions to share open datasets for research securely, promoting standardization and data exchange.',
      url: 'https://www.healthdata29.org/', status: 'live'
    },
    // ── DIAGNOSIS ───────────────────────────────────────────────────
    {
      id: '09', key: 'dx29', name: 'Dx29', category: 'diagnosis',
      tagline: 'Rare disease diagnosis support tool',
      description: 'Provides valuable diagnostic information to patients and healthcare professionals navigating the rare-disease journey.',
      url: 'https://dx29.ai/', status: 'live'
    },
    {
      id: '10', key: 'genewise', name: 'GeneWise', category: 'research',
      tagline: 'Genetics explained for patients',
      description: 'Uses AI to translate complex genetic information into plain language that patients and their families can understand and act on.',
      url: 'https://genewise.azurewebsites.net/', status: 'live'
    },
    {
      id: '11', key: 'gestaltmatcher', name: 'Gestaltmatcher', category: 'research',
      tagline: 'AI facial pattern analysis',
      description: 'Analyzes and compares medical facial patterns using AI, assisting in the diagnosis of rare diseases with a visual phenotype component.',
      url: 'https://gestaltmatcher.azurewebsites.net/', status: 'live'
    },
    // ── REST ────────────────────────────────────────────────────────
    {
      id: '12', key: 'summary29', name: 'Summary29', category: 'information',
      tagline: 'Predecessor to Nav29',
      description: 'Early version of Nav29 that pioneered medical report summarization and health data navigation. Its functionalities are now fully integrated into Nav29.',
      status: 'archived'
    },
    {
      id: '13', key: 'consentgpt', name: 'ConsentGPT', category: 'information',
      tagline: 'Understand your informed consents',
      description: 'AI tool that breaks down complex informed consent documents into clear explanations, empowering patients to make truly informed decisions.',
      url: 'https://conur.azurewebsites.net/', status: 'live'
    },
    {
      id: '14', key: 'orphacare', name: 'OrphaCare', category: 'information',
      tagline: 'Resources for rare disease patients',
      description: 'Platform dedicated to connecting rare disease patients with care resources, specialists, and treatment information.',
      url: 'https://orphacare.azurewebsites.net/', status: 'live'
    },
    {
      id: '15', key: 'rarescope', name: 'RareScope', category: 'information',
      tagline: 'Rare disease information hub',
      description: 'Comprehensive application providing curated information and resources about rare diseases for patients and healthcare professionals.',
      status: 'dev'
    },
    {
      id: '16', key: 'raito_network', name: 'Raito Network', category: 'data',
      tagline: 'Patient data for research, securely',
      description: 'Platform for patients to manage health data and share it for research. Includes tools for patient-group administrators to run questionnaires and track health statistics.',
      url: 'https://raito.network/', status: 'live'
    },
    {
      id: '17', key: 'health29', name: 'Health 29', category: 'data',
      tagline: 'Patient-driven health registries',
      description: 'System for creating patient registries and generating knowledge from patient-reported health variables. Gives patients real ownership of their data.',
      url: 'https://health29.org/', status: 'live'
    },
    {
      id: '18', key: 'raito_open', name: 'Raito Open', category: 'data',
      tagline: 'Open health data for science',
      description: 'Open, decentralized tool that lets patients share their medical data to accelerate research and the development of new treatments.',
      url: 'https://openraito.azurewebsites.net/', status: 'live'
    },
    {
      id: '19', key: 'raito', name: 'Raito', category: 'data',
      tagline: 'Decentralized health data wallet',
      description: 'Decentralized platform for patients to securely own, control, and selectively share their medical data.',
      url: 'https://raito.care/', status: 'live'
    },
    {
      id: '20', key: 'iasalut', name: 'IASalutAjudaDx', category: 'diagnosis',
      tagline: 'AI diagnosis support in Catalan',
      description: 'Catalan-language diagnostic support application using advanced language models for disease identification. Deployed for a regional health service.',
      status: 'restricted'
    },
    {
      id: '21', key: 'sermasgpt', name: 'SermasGPT', category: 'diagnosis',
      tagline: 'AI diagnosis for SERMAS network',
      description: 'Diagnostic support tool deployed within the Madrid Health Service (SERMAS) network. Access restricted to SERMAS healthcare professionals.',
      status: 'restricted'
    },
    // ── HUMANITARIAN ────────────────────────────────────────────────
    {
      id: '22', key: 'ayudamos_valencia', name: 'Ayudamos Valencia', category: 'humanitarian',
      tagline: 'Healthcare access for Valencia',
      description: 'Platform deployed after the Valencia floods providing rapid healthcare assistance and resource coordination for affected patients.',
      url: 'https://ayudamosvalencia.com/', status: 'archived'
    },
    {
      id: '23', key: 'conectamos_valencia', name: 'Conectamos Valencia', category: 'humanitarian',
      tagline: 'Connecting patients and professionals',
      description: 'Application connecting patients with healthcare professionals in Valencia, facilitating collaboration and information exchange.',
      url: 'https://conectamosvalencia.com/', status: 'archived'
    },
  ];

  readonly categoryMeta: Record<Exclude<ToolCategory, 'all'>, { label: string; color: string }> = {
    diagnosis:    { label: 'Diagnosis',     color: '#E8302A' },
    data:         { label: 'Patient Data',  color: '#38bdf8' },
    research:     { label: 'Research',      color: '#a78bfa' },
    information:  { label: 'Information',   color: '#34d399' },
    humanitarian: { label: 'Humanitarian',  color: '#fbbf24' },
  };

  constructor(private router: Router, private eventsService: EventsService) {
    this.lang = this.eventsService.currentLanguage();
    effect(() => {
      const lang = this.eventsService.currentLanguage();
      if (lang !== this.lang) this.lang = lang;
    });
    this.buildFilters();
  }

  buildFilters() {
    const cats: ToolCategory[] = ['all', 'diagnosis', 'data', 'research', 'information', 'humanitarian'];
    this.filters = cats.map(key => ({
      key,
      label: key === 'all' ? 'All Tools' : this.categoryMeta[key as Exclude<ToolCategory, 'all'>].label,
      count: key === 'all' ? this.tools.length : this.tools.filter(t => t.category === key).length,
    }));
  }

  get filteredTools(): Tool[] {
    if (this.activeFilter === 'all') return this.tools;
    return this.tools.filter(t => t.category === this.activeFilter);
  }

  setFilter(f: ToolCategory) {
    this.activeFilter = f;
  }

  categoryColor(tool: Tool): string {
    return this.categoryMeta[tool.category].color;
  }

  categoryLabel(tool: Tool): string {
    return this.categoryMeta[tool.category].label;
  }

  open(tool: Tool) {
    if (tool.status === 'archived' || tool.status === 'restricted') return;
    if (tool.url) {
      window.open(tool.url, '_blank');
    } else if (tool.routerLink) {
      if (tool.newTab) {
        window.open(tool.routerLink, '_blank');
      } else {
        this.router.navigate([tool.routerLink]);
      }
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
