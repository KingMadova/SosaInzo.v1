import { Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";

// Interface pour les options passées au hook
interface UseAppwriteOptions<T, P extends Record<string, string | number>> {
  // Fonction asynchrone qui sera appelée pour récupérer les données
  fn: (params: P) => Promise<T>;
  // Paramètres optionnels à passer à la fonction
  params?: P;
  // Indicateur pour ignorer l'exécution initiale
  skip?: boolean;
}

// Interface pour le retour du hook
interface UseAppwriteReturn<T, P> {
  // Données récupérées
  data: T | null;
  // Indicateur de chargement
  loading: boolean;
  // Message d'erreur, s'il y en a un
  error: string | null;
  // Fonction pour relancer la requête avec de nouveaux paramètres
  refetch: (newParams: P) => Promise<void>;
}

// Hook personnalisé pour gérer les appels à Appwrite
export const useAppwrite = <T, P extends Record<string, string | number>>({
  fn,
  params = {} as P,
  skip = false,
}: UseAppwriteOptions<T, P>): UseAppwriteReturn<T, P> => {
  // État pour stocker les données récupérées
  const [data, setData] = useState<T | null>(null);
  // État pour indiquer si une requête est en cours
  const [loading, setLoading] = useState(!skip);
  // État pour stocker les messages d'erreur
  const [error, setError] = useState<string | null>(null);

  // Fonction pour effectuer la requête
  const fetchData = useCallback(
    async (fetchParams: P) => {
      setLoading(true); // Démarre le chargement
      setError(null); // Réinitialise les erreurs

      try {
        // Appelle la fonction passée en paramètre avec les paramètres fournis
        const result = await fn(fetchParams);
        setData(result); // Stocke les données récupérées
      } catch (err: unknown) {
        // Gère les erreurs et affiche une alerte
        const errorMessage =
          err instanceof Error ? err.message : "An unknown error occurred";
        setError(errorMessage);
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false); // Termine le chargement
      }
    },
    [fn] // Dépendance sur la fonction `fn`
  );

  // Effectue la requête initiale si `skip` est faux
  useEffect(() => {
    if (!skip) {
      fetchData(params);
    }
  }, []); // Dépendance vide pour ne s'exécuter qu'une fois au montage

  // Fonction pour relancer la requête avec de nouveaux paramètres
  const refetch = async (newParams: P) => await fetchData(newParams);

  // Retourne les données, l'état de chargement, l'erreur et la fonction `refetch`
  return { data, loading, error, refetch };
};