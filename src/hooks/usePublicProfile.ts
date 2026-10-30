import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { publicProfileFallback } from "@/data/publicProfile";

export function usePublicProfile() {
  const query = useQuery({
    queryKey: ["public-profile"],
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase.from("profile")
        .select("name,title,bio,email,linkedin,github,photo_url,skills,role_title,value_proposition,core_skills,resume_url,education,career,memberships,languages")
        .limit(1).abortSignal(signal).maybeSingle();
      if (error) throw error;
      return data ?? publicProfileFallback;
    },
    placeholderData: publicProfileFallback,
    staleTime: 60_000,
    retry: false,
  });
  return query.data ?? publicProfileFallback;
}
