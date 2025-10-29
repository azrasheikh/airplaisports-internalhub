// Database operations for activity logs

export async function getActivityLogs(supabase, limit = 50) {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function createActivityLog(supabase, action, pageId = null) {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('activity_logs')
    .insert([{
      user_id: user.id,
      user_name: user.user_metadata?.name || user.email,
      action,
      page_id: pageId
    }])
    .select()
    .single()

  if (error) throw error
  return data
}
