const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = "https://jfqhohgczksnkrubhcbu.supabase.co"; // Remplacez par votre URL Supabase
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmcWhvaGdjemtzbmtydWJoY2J1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU3MjQwMjEsImV4cCI6MjA1MTMwMDAyMX0.dd97cM62cJcU_04I95EknHdg1fk9Awh2Ah9HqhExsYY"; // Remplacez par votre clé publique

const supabase = createClient(supabaseUrl, supabaseKey);


module.exports = { supabase };