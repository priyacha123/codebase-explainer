package com.example.Backend.Controller;
import com.example.Backend.Service.GitHubService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RepoController {

    @Autowired
    private GitHubService gitHubService;

    @GetMapping("/analyze")
    public List<Map<String, String>> analyzeRepo(@RequestParam String repoUrl) {
        return gitHubService.getRepoFiles(repoUrl);
    }

    @PostMapping("/upload")
    public Map<String, Object> uploadZip(@RequestParam("file") org.springframework.web.multipart.MultipartFile file) throws Exception {
        return gitHubService.processZipAdvanced(file);
    }

}
