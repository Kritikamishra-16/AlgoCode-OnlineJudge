# Algocode Problem Setting Service


__________________________________

## How routing is working in the project

-/api/v1/problems/ping 
    - besause the routes starts with /api
        /api      ->   /v1    ->     /problems ->       /ping
        apiRouter -> v1Router -> problemRouter -> problemController -> service layer