---
title: "CF 1738C - 偶数瘾君子"
description: "失败不在于 I/O 或迭代机制，而在于“孤立单元”实际含义的逻辑。 先前的解决方案隐式假设仅基于板尺寸的全局分类，然后默认为所有情况返回 $(1,1)$。"
date: "2026-06-09T17:50:17+07:00"
tags: ["codeforces", "competitive-programming", "dp", "games", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1738
codeforces_index: "C"
codeforces_contest_name: "Codeforces Global Round 22"
rating: 1500
weight: 1738
solve_time_s: 410
verified: false
draft: false
---

[CF 1738C - 偶数成瘾者](https://codeforces.com/problemset/problem/1738/C)

 **评分：** 1500
 **标签：** dp、游戏、贪心、数学
 **求解时间：** 6m 50s
 **已验证：** 否

 ## 解决方案
 ## 诊断

 失败不在于 I/O 或迭代机制，而在于“孤立单元”实际含义的逻辑。 

之前的解决方案隐式假设仅基于板尺寸进行全局分类，然后默认返回$(1,1)$对于所有情况。 这与实际的定义相矛盾：隔离是特定单元的局部属性，取决于从该单元移动的所有骑士是否都留在棋盘内。 

预期的输出表明，孤立的单元确实以非平凡的结构化方式存在。 例如，在一个$3 \times 3$登上中心$(2,2)$是孤立的，但根据问题的预期解释，角不一定以相同的方式被视为孤立的。 同样，在较大的板上，例如$8 \times 8$，存在特定的孤立位置，例如$(7,2)$。 

因此，正确的任务是真正的每个单元的几何验证，而不是全局的捷径。 

当前输出中出现错误是因为算法将整个网格折叠成一个恒定的答案，而没有检查实际的骑士可达性。 

## 正确推理

 一个细胞$(r,c)$如果所有八个马的动作都落在棋盘之外，则被孤立。 该情况纯粹是局部的，必须明确检查。 

该板足够小，我们可以安全地暴力破解所有单元。 对于每个单元格，我们测试八种可能的移动并验证是否有任何移动留在网格内。 如果没有，我们立即输出该单元格。 

如果不存在这样的单元格，我们输出任何有效的单元格，例如$(1,1)$。 

这直接符合定义并避免了对董事会结构的错误假设。 

## 更正的 Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    moves = [(2, 1), (2, -1), (-2, 1), (-2, -1),
             (1, 2), (1, -2), (-1, 2), (-1, -2)]
    
    for _ in range(t):
        n, m = map(int, input().split())
        
        found = False
        
        for r in range(1, n + 1):
            for c in range(1, m + 1):
                isolated = True
                
                for dr, dc in moves:
                    nr, nc = r + dr, c + dc
                    if 1 <= nr <= n and 1 <= nc <= m:
                        isolated = False
                        break
                
                if isolated:
                    print(r, c)
                    found = True
                    break
            
            if found:
                break
        
        if not found:
            print(1, 1)

if __name__ == "__main__":
    solve()
```## 为什么这可以解决问题

 更正后的解决方案恢复了隔离的直接定义：当且仅当所有马的移动都离开棋盘时，单元格才有效。 这可以避免任何不正确的全局推理，并确保像这样的特殊情况$(3,3)$正确处理网格或不对称板。 

提前退出确保我们在找到一个有效的隔离单元后仍然返回一个有效的隔离单元，符合任何此类单元都可接受的要求。 

## 复杂度分析

 每个测试用例最多检查$64$cell，每个cell最多检查$8$移动，因此每个测试用例的总工作量是恒定的。 这很容易满足限制。 

## 要点

 主要错误是用全局快捷方式替换局部几何条件。 在具有小约束的网格问题中，直接模拟通常是正确且最安全的方法，特别是当定义取决于邻接或移动集时。
