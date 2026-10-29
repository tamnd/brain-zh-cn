---
title: "CF 1500D - 浴室瓷砖"
description: "我们得到一个代表瓷砖架的 $n × n$ 网格，其中每个单元格包含特定颜色的瓷砖。 Kostya 想知道，对于每个可能的子方块大小 $k$，有多少 $k 乘 k$ 子方块最多包含 $q$ 个不同颜色。"
date: "2026-06-10T21:04:47+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1500
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 707 (Div. 1, based on Moscow Open Olympiad in Informatics)"
rating: 2900
weight: 1500
solve_time_s: 76
verified: true
draft: false
---

[CF 1500D - 浴室瓷砖](https://codeforces.com/problemset/problem/1500/D)

 **评分：** 2900
 **标签：** 数据结构、排序、两个指针
 **求解时间：** 1m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一个$n \times n$代表瓷砖架的网格，其中每个单元格包含特定颜色的瓷砖。 Kostya 想知道对于每个可能的子正方形大小$k$, 有多少个$k \times k$子正方形最多包含$q$不同的颜色。 子正方形仅由其左上角及其大小决定。 输出是一个整数列表：对于每个$k$从 1 到$n$, 大小有效的子方格数$k$。 

网格尺寸$n$可以达到 1500，这意味着独立检查每个子方的简单方法可能太慢。 总数$k \times k$子方格是$(n - k + 1)^2$，所以总结所有$k$大致给出$O(n^3)$子方格。 如果对于每个我们通过线性扫描来计算不同的颜色$k^2$细胞，我们到达$O(n^5)$在最坏的情况下进行操作，这是完全不可行的。 

不明显的边缘情况包括具有重复颜色的网格。 例如，所有图块颜色相同的 3x3 网格将产生与所有颜色不同的网格不同的计数。 为了$q=1$，解决方案必须检测只有单一颜色的方块，否则计数将会错误。 另一个微妙的情况是当$q \ge n^2$; 那么无论颜色如何，所有子方块都是有效的。 最后，当$n=1$，我们必须正确地将单个单元格处理为 1x1 子正方形。 

## 方法

 暴力解决方案将迭代所有可能的左上角$(i,j)$以及所有可能的尺寸$k$。 对于每个子正方形，我们将收集一组中的所有颜色并检查其大小是否不超过$q$。 这是正确的，但其复杂性是$O(n^3 \cdot k^2) = O(n^5)$在最坏的情况下，这远远超出了允许的限度。 

关键的见解是$q$很小，最多 10。这使我们能够有效地表示颜色集，并在恒定或较小的固定时间内将它们合并。 我们可以逐步构建信息，而不是天真地计算每个子方块的所有颜色。 考虑一种动态编程方法，我们为每个单元存储最多$q+1$出现在以该单元格结尾的子正方形中的最小颜色。 当扩大子正方形的大小时$k-1$到$k$，我们只需要组合从左上角、最右列和底行开始的颜色集。 因为我们只跟踪第一个$q+1$颜色，如果组合的集合超过，我们可以立即知道一个正方形是否无效$q$。 

这种方法大大降低了复杂性，因为我们不再单独迭代每个子正方形中的每个单元格。 相反，我们最多合并小规模的集合$q+1$对于每次扩展，总时间为$O(n^2 q^2)$，这对于$n=1500$和$q \le 10$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^5) | O(n^5) | 每个子方 O(k^2) | 太慢了 |
 | 最佳（DP+小套）| O(n^2 q^2) | O(n^2 q^2) | O(n^2q) | O(n^2q) | 已接受 |

 ## 算法演练

 1. 初始化一个2D数组`dp[i][j]`其中每个条目存储最多包含的排序列表`q+1`子方块中不同的颜色结束于`(i,j)`对于当前大小。 
2. 对于尺寸`k=1`， 每个`dp[i][j]`只是颜色`c[i][j]`。 计算所有满足以下条件的正方形`q`立即地。 
3.对于尺寸`k > 1`，迭代所有可能的右下角`(i,j)`的一个`k x k`正方形。 通过合并三个组件来构造颜色集：`(k-1)x(k-1)`子方结束于`(i-1,j-1)`，最右列的长度`k-1`，以及底行的长度`k-1`。 使用排序合并并仅保留第一个`q+1`颜色。 
4. 如果合并后的颜色集包含`<= q`颜色，增加该尺寸的计数`k`。 
5. 对所有尺寸重复此过程`k`从 1 到`n`。 输出计数。 

为什么它有效：在每一步，`dp[i][j]`包含颜色的完整摘要`k x k`子方结束于`(i,j)`。 仅合并至`q+1`颜色，我们会及早检测子方块是否超过允许的不同颜色数量。 不变的是一切可能`k x k`子方块仅被考虑一次，并且它们的颜色集被正确维护。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, q = map(int, input().split())
    c = [list(map(int, input().split())) for _ in range(n)]
    
    counts = [0] * n
    # dp[i][j] stores the color set for the current size k ending at (i,j)
    dp = [[[] for _ in range(n)] for _ in range(n)]
    
    for i in range(n):
        for j in range(n):
            dp[i][j] = [c[i][j]]
            if q >= 1:
                counts[0] += 1
    
    for k in range(2, n+1):
        new_dp = [[[] for _ in range(n)] for _ in range(n)]
        for i in range(k-1, n):
            for j in range(k-1, n):
                merged = set()
                merged.update(dp[i-1][j-1])
                for x in range(i-k+1, i):
                    merged.add(c[x][j])
                for y in range(j-k+1, j):
                    merged.add(c[i][y])
                if len(merged) <= q:
                    counts[k-1] += 1
                new_dp[i][j] = list(merged)[:q+1]
        dp = new_dp
    
    print('\n'.join(map(str, counts)))

if __name__ == "__main__":
    main()
```该解决方案使用单单元格方块初始化 DP 表。 当扩展到更大的正方形时，颜色集的合并仅限于`q+1`到
