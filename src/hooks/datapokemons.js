import { useState, useEffect, useCallback, useRef } from "react" // Importe useRef

function usePokemons(initialOffset = 0, initialLimit = 20) {
	const [pokemons, setPokemons] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [offset, setOffset] = useState(initialOffset)
	const [limit] = useState(initialLimit)
	const [hasMore, setHasMore] = useState(true)

	const initialFetchDone = useRef(false)

	const fetchData = useCallback(
		async (currentOffset) => {
			try {
				setLoading(true)
				setError(null)

				const url = `https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=${limit}`
				const response = await fetch(url)

				if (!response.ok) {
					throw new Error("Falha ao carregar lista de Pokémons.")
				}

				const data = await response.json()
				const pokemonResults = data.results

				if (pokemonResults.length < limit || data.next === null) {
					setHasMore(false)
				} else {
					setHasMore(true)
				}

				const detailedPokemonPromises = pokemonResults.map(async (p) => {
					const pokemonDetailResponse = await fetch(p.url)
					if (!pokemonDetailResponse.ok) {
						console.warn(`Falha ao carregar detalhes para ${p.name}`)
						return null
					}
					const detailData = await pokemonDetailResponse.json()
					return {
						id: detailData.id,
						name: detailData.name,
						number: detailData.id,
						photo: detailData.sprites.front_default,
						types: detailData.types.map((typeInfo) => typeInfo.type.name)
					}
				})

				const newDetailedPokemons = (
					await Promise.all(detailedPokemonPromises)
				).filter(Boolean)

				setPokemons((prevPokemons) => [...prevPokemons, ...newDetailedPokemons])
			} catch (err) {
				setError(err.message)
			} finally {
				setLoading(false)
			}
		},
		[limit]
	)

	useEffect(() => {
		if (!initialFetchDone.current) {
			fetchData(offset)
			initialFetchDone.current = true
		} else if (offset > initialOffset) {
			fetchData(offset)
		}
	}, [offset, fetchData, initialOffset])

	const loadMore = useCallback(() => {
		setOffset((prevOffset) => prevOffset + limit)
	}, [limit])

	return { pokemons, loading, error, loadMore, hasMore }
}

export default usePokemons
