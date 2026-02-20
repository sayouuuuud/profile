-- Migrate existing case study structured data into content_blocks for each case study
-- We build the blocks array from stat_cards, challenges, solutions, architecture, code, system_report

UPDATE case_studies SET content_blocks = (
  SELECT jsonb_agg(block ORDER BY sort_order) FROM (
    -- Stat cards become individual blocks with 1/3 width
    SELECT 
      idx - 1 AS sort_order,
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'type', CASE 
          WHEN elem->>'type' = 'donut' THEN 'stat-donut'
          WHEN elem->>'type' = 'progress' THEN 'stat-progress'
          WHEN elem->>'type' = 'bars' THEN 'stat-bars'
          ELSE 'stat-donut'
        END,
        'width', '1/3',
        'sort_order', idx - 1,
        'data', elem
      ) AS block
    FROM jsonb_array_elements(COALESCE(stat_cards, '[]'::jsonb)) WITH ORDINALITY AS t(elem, idx)
    
    UNION ALL
    
    -- Challenges list as one block with 1/2 width
    SELECT 
      10 AS sort_order,
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'type', 'challenges-list',
        'width', '1/2',
        'sort_order', 10,
        'data', jsonb_build_object('items', COALESCE(challenges, '[]'::jsonb))
      ) AS block
    WHERE jsonb_array_length(COALESCE(challenges, '[]'::jsonb)) > 0
    
    UNION ALL
    
    -- Solutions list as one block with 1/2 width
    SELECT 
      11 AS sort_order,
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'type', 'solutions-list',
        'width', '1/2',
        'sort_order', 11,
        'data', jsonb_build_object('items', COALESCE(solutions, '[]'::jsonb))
      ) AS block
    WHERE jsonb_array_length(COALESCE(solutions, '[]'::jsonb)) > 0
    
    UNION ALL
    
    -- Architecture diagram as full-width block
    SELECT 
      20 AS sort_order,
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'type', 'architecture-diagram',
        'width', 'full',
        'sort_order', 20,
        'data', jsonb_build_object('nodes', COALESCE(architecture_nodes, '[]'::jsonb))
      ) AS block
    WHERE jsonb_array_length(COALESCE(architecture_nodes, '[]'::jsonb)) > 0
    
    UNION ALL
    
    -- Code terminal as 1/2 width block
    SELECT 
      30 AS sort_order,
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'type', 'code-terminal',
        'width', '1/2',
        'sort_order', 30,
        'data', elem
      ) AS block
    FROM jsonb_array_elements(COALESCE(code_snippets, '[]'::jsonb)) WITH ORDINALITY AS t(elem, idx)
    LIMIT 1
    
    UNION ALL
    
    -- System report as 1/2 width block
    SELECT 
      31 AS sort_order,
      jsonb_build_object(
        'id', gen_random_uuid()::text,
        'type', 'system-report',
        'width', '1/2',
        'sort_order', 31,
        'data', COALESCE(system_report, '{}'::jsonb)
      ) AS block
    WHERE system_report IS NOT NULL AND system_report != '{}'::jsonb
  ) sub
)
WHERE content_blocks IS NULL OR content_blocks = '[]'::jsonb;
