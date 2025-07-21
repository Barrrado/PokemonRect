import React, { useState } from "react"
import usePokemonDetails from "../hooks/pokedetais"
import "../styles/poke.css"
import "../styles/buttons.css"
import { getTypeColor } from "../styles/elementos"

function PokemonModal({ pokemon, onClose }) {
	const [activeTab, setActiveTab] = useState("basic")

	const pokemonUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`
	const { details, loading, error } = usePokemonDetails(pokemonUrl)

	if (!pokemon) return null

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<div
					className="divpoke"
					style={{
						backgroundColor:
							pokemon.types && pokemon.types.length > 0
								? getTypeColor(pokemon.types[0])
								: "#f7f7f7"
					}}
				>
					<h2>
						{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} #
						{pokemon.number.toString().padStart(3, "0")}
					</h2>
					<img
						src={pokemon.photo}
						alt={pokemon.name}
						className="modal-pokemon-image"
					/>
				</div>

				{loading && <p>Carregando detalhes...</p>}
				{error && <p>Erro: {error}</p>}

				{details && (
					<div className="modal-body">
						<div className="tabs-container">
							<button
								className={`tab-button ${activeTab === "basic" ? "active" : ""}`}
								onClick={() => setActiveTab("basic")}
							>
								Informações
							</button>
							<button
								className={`tab-button ${activeTab === "abilities" ? "active" : ""}`}
								onClick={() => setActiveTab("abilities")}
							>
								Habilidades
							</button>
							<button
								className={`tab-button ${activeTab === "stats" ? "active" : ""}`}
								onClick={() => setActiveTab("stats")}
							>
								Estatísticas
							</button>
						</div>

						<div className="tab-content-container">
							{activeTab === "basic" && (
								<div className="modal-section">
									<p>
										<strong>Altura:</strong> {details.height} m
									</p>
									<p>
										<strong>Peso:</strong> {details.weight} kg
									</p>
									<p>
										<strong>Tipos:</strong>{" "}
										{details.types
											.map(
												(type) => type.charAt(0).toUpperCase() + type.slice(1)
											)
											.join(", ")}
									</p>
									<p>
										<strong>Gênero:</strong> Desconhecido/Não disponível
									</p>
								</div>
							)}

							{activeTab === "abilities" && (
								<div className="modal-section">
									<ul>
										{details.abilities.map((ability, index) => (
											<li key={index}>
												{ability.charAt(0).toUpperCase() + ability.slice(1)}
											</li>
										))}
									</ul>
								</div>
							)}

							{activeTab === "stats" && (
								<div className="modal-section">
									<ul>
										{details.stats.map((stat, index) => (
											<li key={index}>
												<strong>
													{stat.name.charAt(0).toUpperCase() +
														stat.name.slice(1)}
													:
												</strong>{" "}
												{stat.value}
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default PokemonModal
