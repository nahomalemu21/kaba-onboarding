module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const ans = req.body;
  const NOTION_TOKEN = 'ntn_q61648676659GGuch3NaZtW2IMEAMpVGgr6EhqNt2ol0II';
  const DB_ID = '3cbe215d-00ac-42cb-95b9-cea5fcbf4aac';

  function txt(val) {
    return [{ type: 'text', text: { content: String(val || '').slice(0, 2000) } }];
  }

  const props = {
    'Full Name':             { title: txt(ans.q1 || 'Unknown') },
    'Business Name':         { rich_text: txt(ans.q2 || '') },
    'Phone':                 { phone_number: ans.q3 || null },
    'Location':              { rich_text: txt(ans.q4 || '') },
    'Products / Services':   { rich_text: txt(ans.q6 || '') },
    'Branch Locations':      { rich_text: txt(ans.q8 || '') },
    'Ideal Customer':        { rich_text: txt(ans.q9 || '') },
    'Why Choose Them':       { rich_text: txt(ans.q10 || '') },
    'Expected Results':      { rich_text: txt(ans.q13 || '') },
    'Main Competitors':      { rich_text: txt(ans.q14 || '') },
    'Competitor Feedback':   { rich_text: txt(ans.q15 || '') },
    'Admired Brands':        { rich_text: txt(ans.q16 || '') },
    'Brand Colors':          { rich_text: txt(ans.q19 || '') },
    'Social Media Links':    { rich_text: txt(ans.q21 || '') },
    'Content Approver':      { rich_text: txt(ans.q22 || '') },
    'Agency Experience':     { rich_text: txt(ans.q24 || '') },
    'Status':                { select: { name: 'New 🆕' } },
  };

  if (ans.q5)  props['Contact Method']     = { select: { name: ans.q5 } };
  if (ans.q7)  props['Has Branches']       = { select: { name: ans.q7 } };
  if (ans.q17) props['Has Branding']       = { select: { name: ans.q17 } };
  if (ans.q18) props['Brand Files Link']   = { url: ans.q18 };
  if (ans.q23) props['Worked With Agency'] = { select: { name: ans.q23 } };
  if (ans.q25) props['How Heard of KABA']  = { select: { name: ans.q25 } };
  if (ans.q26) props['Team Size']          = { select: { name: ans.q26 } };

  if (Array.isArray(ans.q11) && ans.q11.length)
    props['Main Challenges']      = { multi_select: ans.q11.map(n => ({ name: n })) };
  if (Array.isArray(ans.q12) && ans.q12.length)
    props['3-Month Goals']        = { multi_select: ans.q12.map(n => ({ name: n })) };
  if (Array.isArray(ans.q20) && ans.q20.length)
    props['Content Types Wanted'] = { multi_select: ans.q20.map(n => ({ name: n })) };

  try {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + NOTION_TOKEN,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({ parent: { database_id: DB_ID }, properties: props })
    });

    const data = await response.json();

    if (data.id) {
      res.status(200).json({ success: true, id: data.id });
    } else {
      res.status(500).json({ success: false, error: data });
    }
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
}
