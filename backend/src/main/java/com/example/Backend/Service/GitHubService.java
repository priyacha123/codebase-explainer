package com.example.Backend.Service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

@Service
public class GitHubService {

    // ================== GITHUB API ==================
    public List<Map<String, String>> getRepoFiles(String repoUrl) {

        String[] parts = repoUrl.replace("https://github.com/", "").split("/");
        String owner = parts[0];
        String repo = parts[1];

        String apiUrl = "https://api.github.com/repos/" + owner + "/" + repo + "/contents";

        RestTemplate restTemplate = new RestTemplate();
        Object[] response = restTemplate.getForObject(apiUrl, Object[].class);

        List<Map<String, String>> result = new ArrayList<>();

        if (response == null) return result;

        for (Object obj : response) {
            Map file = (Map) obj;

            Map<String, String> fileData = new HashMap<>();
            fileData.put("name", (String) file.get("name"));
            fileData.put("type", (String) file.get("type"));
            fileData.put("summary", "This file is part of the project structure.");

            result.add(fileData);
        }

        return result;
    }

    // ================== ZIP ANALYSIS ==================
    public Map<String, Object> processZipAdvanced(MultipartFile file) throws Exception {

        List<String> fileNames = new ArrayList<>();
        Set<String> folders = new HashSet<>();
        Set<String> languages = new HashSet<>();
        List<String> entryPoints = new ArrayList<>();
        Map<String, List<String>> fileTree = new HashMap<>();

        ZipInputStream zis = new ZipInputStream(file.getInputStream());
        ZipEntry entry;

        while ((entry = zis.getNextEntry()) != null) {

            if (entry.isDirectory()) continue;

            String name = entry.getName();

            // ========= FILTER NOISE =========
            if (name.contains("node_modules") ||
                    name.endsWith(".map") ||
                    name.endsWith(".json") ||
                    name.endsWith(".lock")) {
                continue;
            }

            // ========= FOCUS IMPORTANT FILES =========
            if (!(name.contains("src/") ||
                    name.contains("controller") ||
                    name.contains("service") ||
                    name.contains("app"))) {
                continue;
            }

            // ========= PROCESS =========
            fileNames.add(name);

            // folders
            if (name.contains("/")) {
                String folder = name.split("/")[0];
                folders.add(folder);

                fileTree.putIfAbsent(folder, new ArrayList<>());
                fileTree.get(folder).add(name);
            }

            // language detection
            if (name.endsWith(".java")) languages.add("Java");
            if (name.endsWith(".js")) languages.add("JavaScript");
            if (name.endsWith(".py")) languages.add("Python");

            // entry point detection
            String lower = name.toLowerCase();
            if (lower.endsWith("main.java") ||
                    lower.endsWith("application.java") ||
                    lower.endsWith("index.js") ||
                    lower.contains("app.js") ||
                    lower.contains("server.js")) {
                entryPoints.add(name);
            }
        }

        zis.close();

        // ========= SMART SUGGESTIONS =========
        List<String> suggestions = new ArrayList<>();
        suggestions.add("Start from main or entry files");
        suggestions.add("Explore src folder for core logic");
        suggestions.add("Check controller/service layers");
        suggestions.add("Dependencies are ignored for clarity (node_modules filtered)");

        // ========= FINAL RESPONSE =========
        Map<String, Object> result = new HashMap<>();
        result.put("totalFiles", fileNames.size());
        result.put("folders", folders);
        result.put("languages", languages);
        result.put("entryPoints", entryPoints);
        result.put("fileTree", fileTree);
        result.put("suggestions", suggestions);
        result.put("files", fileNames);

        return result;
    }
}