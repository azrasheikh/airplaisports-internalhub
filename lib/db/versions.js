// Database operations for version history

export async function getVersionHistory(supabase, pageId, limit = 10) {
  const { data, error } = await supabase
    .from('version_history')
    .select('*')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function createVersion(supabase, pageId, components) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('version_history')
    .insert([{
      page_id: pageId,
      user_id: user.id,
      user_name: user.user_metadata?.name || user.email,
      components
    }])
    .select()
    .single()

  if (error) throw error
  return data
}
