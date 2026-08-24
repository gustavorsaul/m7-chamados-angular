import { Component, output, signal } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Prioridade, StatusChamado } from "../../models/chamado";

export interface DadosNovoChamado {
  titulo: string;
  descricao: string;
  prioridade: Prioridade;
  status: StatusChamado;
  responsavel: string;
}

@Component({
  selector: "app-criar-chamado",
  standalone: true,
  imports: [FormsModule],
  templateUrl: "./criar-chamado.html",
  styleUrl: "./criar-chamado.css"
})

export class CriarChamado {
  readonly aberto = signal(false);
  readonly chamadoCriado = output<DadosNovoChamado>();

  readonly dados = {
    titulo: "",
    descricao: "",
    prioridade: "media" as Prioridade,
    status: "aberto" as StatusChamado,
    responsavel: ""
  };

  alternar(): void {
    this.aberto.update(aberto => !aberto);
  }

  criar(): void {
    this.chamadoCriado.emit({
      titulo: this.dados.titulo.trim(),
      descricao: this.dados.descricao.trim(),
      prioridade: this.dados.prioridade,
      status: this.dados.status,
      responsavel: this.dados.responsavel.trim()
    });
    this.limpar();
    this.aberto.set(false);
  }

  private limpar(): void {
    this.dados.titulo = "";
    this.dados.descricao = "";
    this.dados.prioridade = "media";
    this.dados.status = "aberto";
    this.dados.responsavel = "";
  }
}
