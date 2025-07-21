import React, { useState } from "react"
import usePokemons from "../hooks/datapokemons"
import "../styles/poke.css"
import PokemonModal from "./modalpoke"
import { getTypeColor } from "../styles/elementos"

function ConvertPokemonToLi() {
	const { pokemons, loading, error, loadMore, hasMore } = usePokemons(0, 20)
	const [selectedPokemon, setSelectedPokemon] = useState(null)

	const openModal = (pokemon) => {
		setSelectedPokemon(pokemon)
	}

	const closeModal = () => {
		setSelectedPokemon(null)
	}

	if (loading && pokemons.length === 0) {
		return <p>Carregando Pokémons...</p>
	}

	if (error) {
		return <p>Erro ao carregar Pokémons: {error}</p>
	}

	if (pokemons.length === 0 && !loading) {
		return <p>Nenhum Pokémon encontrado.</p>
	}

	return (
		<>
			<ul className="pokemon-list">
				{pokemons.map((pokemon) => (
					<li
						key={pokemon.id}
						className="pokemon-item"
						onClick={() => openModal(pokemon)}
						style={{
							backgroundColor:
								pokemon.types && pokemon.types.length > 0
									? getTypeColor(pokemon.types[0])
									: "#f7f7f7"
						}}
					>
						<span className="number">
							#{pokemon.number.toString().padStart(3, "0")}
						</span>{" "}
						<div className="detail">
							<img src={pokemon.photo} alt={pokemon.name} />
							<span className="name">{pokemon.name}</span>
							{/* Opcional: Exibir os tipos dentro do item da lista */}
							<div className="pokemon-types">
								{pokemon.types &&
									pokemon.types.map((type) => (
										<span
											key={type}
											className="pokemon-type-tag"
											style={{ backgroundColor: getTypeColor(type) }}
										>
											{type.charAt(0).toUpperCase() + type.slice(1)}
										</span>
									))}
							</div>
						</div>
					</li>
				))}
			</ul>
			{hasMore && (
				<div style={{ textAlign: "center", marginTop: "20px" }}>
					<button onClick={loadMore} disabled={loading}>
						{loading ? "Carregando..." : "Carregar Mais Pokémons"}
					</button>
				</div>
			)}
			{selectedPokemon && (
				<PokemonModal pokemon={selectedPokemon} onClose={closeModal} />
			)}
		</>
	)
}

export default ConvertPokemonToLi
