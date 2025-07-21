import { useState, useEffect } from "react"

function usePokemonDetails(pokemonUrl) {
	const [details, setDetails] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)

	useEffect(() => {
		if (!pokemonUrl) {
			setDetails(null)
			return
		}

		const fetchDetails = async () => {
			setLoading(true)
			setError(null)
			try {
				const response = await fetch(pokemonUrl)
				if (!response.ok) {
					throw new Error("Falha ao carregar detalhes do Pokémon.")
				}
				const data = await response.json()

				const extractedDetails = {
					id: data.id,
					name: data.name,
					height: data.height / 10,
					weight: data.weight / 10,
					types: data.types.map((typeInfo) => typeInfo.type.name),
					abilities: data.abilities.map(
						(abilityInfo) => abilityInfo.ability.name
					),
					stats: data.stats.map((statInfo) => ({
						name: statInfo.stat.name,
						value: statInfo.base_stat
					}))
				}

				setDetails(extractedDetails)
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		}

		fetchDetails()
	}, [pokemonUrl])

	return { details, loading, error }
}

export default usePokemonDetails
