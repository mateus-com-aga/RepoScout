/** @format */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
} from "./styles";
import api from "../../services/api";
import AppRoutes from "../../routes";
import { FaArrowLeft } from "react-icons/fa";

interface Repository {
  name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string; // Correção: avatar_url é a chave correta
  };
}

interface Issue {
  id: number;
  labels: { id: number; name: string }[];
  user: {
    login: string;
    avatar_url: string;
  };
  title: string;
  html_url: string;
}

export default function Repositorio() {
  const { repositorio } = useParams();

  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    async function load() {
      const nomeRepo = decodeURIComponent(repositorio || "");

      try {
        const [repositorioData, issuesData] = await Promise.all([
          api.get(`/repos/${nomeRepo}`),
          api.get(`/repos/${nomeRepo}/issues`, {
            params: {
              state: "open",
              per_page: 5,
            },
          }),
        ]);

        setRepository(repositorioData.data);
        setIssues(issuesData.data);
        setLoading(false); // A operação foi concluída
      } catch (error) {
        console.error(error);
        setLoading(false); // Em caso de erro, também devemos parar o loading
      }
    }

    load();
  }, [repositorio]);

  useEffect(() => {
    async function loadIssue() {
      const nomeRepo = decodeURIComponent(repositorio || "");

      try {
        const response = await api.get(`/repos/${nomeRepo}/issues`, {
          params: {
            state: "open",
            page,
            per_page: 5,
          },
        });

        setIssues(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadIssue();
  }, [repositorio, page]);

  function handlePage(action: string) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  if (loading) {
    return (
      <Loading>
        <h1>Carregando...</h1>
      </Loading>
    ); // Pode adicionar um indicador de carregamento
  }

  return (
    <Container>
      <BackButton to={"/"}>
        <FaArrowLeft color="#000" size={30} />
      </BackButton>

      <Owner>
        {/* A imagem do avatar é carregada quando o repositório é encontrado */}

        {repository && repository.owner ? (
          <>
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <h1>{repository.name}</h1>
            <p>{repository.description}</p>
          </>
        ) : (
          <div>Loading repository data...</div>
        )}
      </Owner>

      <IssuesList>
        {issues.map((issue) => (
          <li key={issue.id}>
            <img src={issue.user.avatar_url} alt={issue.user.login} />

            <div>
              <strong>
                <a href={issue.html_url}>{issue.title}</a>

                {issue.labels.map((label) => (
                  <span key={label.id}>{label.name}</span>
                ))}
              </strong>
              <p>{issue.user.login}</p>
            </div>
          </li>
        ))}
      </IssuesList>

      <PageActions>
        <button type="button" onClick={() => handlePage("back")}>
          Voltar
        </button>
        <button type="button" onClick={() => handlePage("next")}>
          Proxima
        </button>
      </PageActions>
    </Container>
  );
}
