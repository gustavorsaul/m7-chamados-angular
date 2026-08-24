import { Component, OnInit, computed, inject, signal } from "@angular/core";
import {
  CriarChamado,
  DadosNovoChamado
} from "../../components/criar-chamado/criar-chamado";
import { FiltroChamados } from "../../components/filtro-chamados/filtro-chamados";
import { ListaChamados } from "../../components/lista-chamados/lista-chamados";
import { Chamado, StatusChamado } from "../../models/chamado";
import { ChamadosService } from "../../services/chamados.service";

@Component({
  selector: "app-chamados-page",
  standalone: true,
  imports: [CriarChamado, FiltroChamados, ListaChamados],
  templateUrl: "./chamados-page.html",
  styleUrl: "./chamados-page.css"
})
export class ChamadosPage implements OnInit {
  private readonly chamadosService = inject(ChamadosService);

  readonly chamados = signal<Chamado[]>([]);
  readonly pesquisa = signal("");
  readonly filtroStatus = signal<StatusChamado | "todos">("todos");
  readonly carregando = signal(false);
  readonly erro = signal<string | null>(null);

  readonly chamadosFiltrados = computed(() => {
    const termo = this.pesquisa().trim().toLowerCase();
    const status = this.filtroStatus();

    return this.chamados().filter(chamado => {
      const correspondeTexto =
        termo === "" ||
        chamado.titulo.toLowerCase().includes(termo) ||
        chamado.descricao.toLowerCase().includes(termo);
      const correspondeStatus =
        status === "todos" || chamado.status === status;
      return correspondeTexto && correspondeStatus;
    });
  });

  ngOnInit(): void {
    void this.carregarChamados();
  }

  atualizarPesquisa(pesquisa: string): void {
    this.pesquisa.set(pesquisa);
  }

  atualizarStatus(status: StatusChamado | "todos"): void {
    this.filtroStatus.set(status);
  }

  adicionarChamado(dados: DadosNovoChamado): void {
    const chamado: Chamado = {
      id: this.proximoId(),
      titulo: dados.titulo,
      descricao: dados.descricao,
      prioridade: dados.prioridade,
      status: dados.status,
      responsavel: dados.responsavel || undefined,
      criadoEm: new Date().toISOString().slice(0, 10)
    };

    this.chamadosService.adicionar(chamado);
    this.chamados.update(chamados => [...chamados, chamado]);
  }

  private proximoId(): number {
    return this.chamados().reduce(
      (maiorId, chamado) => Math.max(maiorId, chamado.id),
      0
    ) + 1;
  }

  private async carregarChamados(): Promise<void> {
    this.carregando.set(true);
    this.erro.set(null);

    try {
      const dados = await this.chamadosService.listar();
      this.chamados.set(dados);
    } catch {
      this.erro.set("Não foi possível carregar os chamados.");
    } finally {
      this.carregando.set(false);
    }
  }
}