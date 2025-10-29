// Database operations for pages

export async function getAllPages(supabase) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) throw error
  return data || []
}

export async function getPage(supabase, pageId) {
  const { data, error } = await supabase
    .from('pages')
    .select('*')
    .eq('id', pageId)
    .single()

  if (error) throw error
  return data
}

export async function createPage(supabase, page) {
  const { data, error } = await supabase
    .from('pages')
    .insert([{
      id: page.id,
      title: page.title,
      parent_id: page.parent,
      icon: page.icon,
      components: page.components || [],
      created_by: (await supabase.auth.getUser()).data.user?.id
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updatePage(supabase, pageId, updates) {
  const { data, error } = await supabase
    .from('pages')
    .update(updates)
    .eq('id', pageId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deletePage(supabase, pageId) {
  const { error } = await supabase
    .from('pages')
    .delete()
    .eq('id', pageId)

  if (error) throw error
}

export async function getNavigationItems(supabase) {
  const { data, error } = await supabase
    .from('navigation_items')
    .select('*')
    .order('position', { ascending: true })

  if (error) throw error
  return data || []
}

export async function createNavigationItem(supabase, navItem) {
  const { data, error } = await supabase
    .from('navigation_items')
    .insert([navItem])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateNavigationItem(supabase, navId, updates) {
  const { data, error } = await supabase
    .from('navigation_items')
    .update(updates)
    .eq('id', navId)
    .select()
    .single()

  if (error) throw error
  return data
}
