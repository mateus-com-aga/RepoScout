/** @format */

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Container, Owner, Loading, BackButton } from "./styles";
import api from "../../services/api";
import AppRoutes from "../../routes";
import { FaArrowLeft } from 'react-icons/fa'

interface Repository {
  name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string; // Correção: avatar_url é a chave correta
  };
}


export default function Repositorio() {
  const { repositorio } = useParams();

  const [repository, setRepository] = useState<Repository | null>(null);
  const [issues, setIssues] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
        setIssues(issuesData.data.map((issue: { title: string }) => issue.title));
        setLoading(false); // A operação foi concluída
      } catch (error) {
        console.error(error);
        setLoading(false); // Em caso de erro, também devemos parar o loading
      }
    }

    load();
  }, [repositorio]);

  if (loading) {
    return <Loading>
      <h1>Carregando...</h1>
    </Loading>; // Pode adicionar um indicador de carregamento
  }

  return (
    <Container>
      <BackButton to={'/'}>
        <FaArrowLeft color="#000" size={30} />
      </BackButton>

      <Owner>
        {/* A imagem do avatar é carregada quando o repositório é encontrado */}
        
        {repository && repository.owner ? (
          <>
            <img src={repository.owner.avatar_url} alt={repository.owner.login} />
            <h1>{repository.name}</h1>
            <p>{repository.description}</p>
          </>
        ) : (
          <div>Loading repository data...</div>
        )}
      </Owner>
    </Container>
  );
}
