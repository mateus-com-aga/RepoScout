/** @format */

import React, { useCallback, useState, useEffect } from "react";
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";

import api from "../../services/api";

export default function Main() {
  // const [newRepo, setNewRepo] = useState("");
  // const [repositories, setRepositories] = useState([]);

  const [repositories, setRepositories] = useState<{ name: string }[]>([]);
  const [newRepo, setNewRepo] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);

  //DidMount
  useEffect(() => {
    const repoStorage = localStorage.getItem("repos");

    if (repoStorage) {
      try {
        const parsedRepos = JSON.parse(repoStorage);
        console.log("Repos loaded from localStorage:", parsedRepos);
        setRepositories(parsedRepos);
      } catch (error) {
        console.error("Error parsing repos from localStorage:", error);
      }
    } else {
      console.log("No repos found in localStorage");
    }
  }, []);

  //DidUpdate
  useEffect(() => {
    console.log("Saving repos to localStorage:", repositories);
    if (repositories.length > 0) {
      localStorage.setItem("repos", JSON.stringify(repositories));
    }
  }, [repositories]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        setAlert(false);
        try {
          if (newRepo === "") {
            throw new Error("Você precisa indicar um repositório");
          }

          const response = await api.get(`repos/${newRepo}`);

          const hasRepo = repositories.find((r) => r.name === newRepo);

          if (hasRepo) {
            throw new Error("Repositório duplicado");
          }

          const data = {
            name: response.data.full_name,
          };

          setRepositories([...repositories, data]);
          setNewRepo("");
        } catch (error) {
          setAlert(true);
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      submit();
    },
    [newRepo, repositories]
  );

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setNewRepo(e.target.value);
    setAlert(false);
  }

  const handleDelete = useCallback(
    (repo: string): void => {
      const find = repositories.filter((r) => r.name !== repo);
      setRepositories(find);
    },
    [repositories]
  );

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        Meus Repositórios
      </h1>

      <Form onSubmit={handleSubmit} error={alert}>
        <input
          type="text"
          placeholder="Adicionar repositório"
          value={newRepo}
          onChange={handleInputChange}
        />

        <SubmitButton Loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>
      </Form>

      <List>
        {repositories.map((repo) => (
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repo.name}
            </span>
            <a href="">
              <FaBars size={20} />
            </a>
          </li>
        ))}
      </List>
    </Container>
  );
}
