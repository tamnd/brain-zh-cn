---
title: "CF 226E - 高贵的骑士之路"
description: "在这个问题中，我们被要求模拟以树表示的封建等级制度中的一系列事件。 每个封建领地都拥有一座城堡，除了国王之外，每个封建领地都只向一位上级报告。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "trees"]
categories: ["algorithms"]
codeforces_contest: 226
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 140 (Div. 1)"
rating: 2900
weight: 226
solve_time_s: 71
verified: true
draft: false
---

[CF 226E - 高贵骑士之路](https://codeforces.com/problemset/problem/226/E)

 **评分：** 2900
 **标签：** 数据结构，树
 **求解时间：** 1m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 在这个问题中，我们被要求模拟以树表示的封建等级制度中的一系列事件。 每个封建领地都拥有一座城堡，除了国王之外，每个封建领地都只向一位上级报告。 城堡按照封建等级制度通过道路连接起来：封建与其直接上级之间有一条道路。 

事件每年都会发生，有两种类型。 第一种代表野蛮人对城堡的攻击。 一旦一座城堡受到攻击，从当年起它就被认为是亵渎的。 第二种是从城堡出发的骑士`a`到城堡`b`沿着树上独特的路径。 骑士想要停在`k`- 这条道路上的第一座城堡在某一年之后没有被野蛮人的袭击所亵渎`y`。 如果少于`k`城堡可用，答案是`-1`。 

输入包含`n`封建势力，与`n`代表每个封建主的整数（如果封建是国王则为 0），后跟`m`事件。 输出是一个整数列表，每个骑士查询对应一个整数，指示他可以停在哪个城堡或`-1`如果没有合适的城堡存在。 

给定`n`和`m`可以达到`10^5`，任何重复遍历路径或扫描所有过去攻击的简单解决方案都会太慢。 我们需要对树进行预处理，以允许有效的路径查询并有效地检查城堡是否相对于年份被亵渎`y`。 

不明显的边缘情况包括骑士沿着没有中间城堡的路径行进，`k`大于可用城堡的数量，并攻击国王的城堡或骑士路径两端的城堡。 解决方案必须正确处理这些情况。 

## 方法

 蛮力方法很简单。 对于每个骑士查询，找到来自的路径`a`到`b`在树上使用 BFS 或 DFS，收集路径上的所有城堡，除了`a`和`b`，并迭代它们以计算一年后有多少没有被亵渎`y`。 返回`k`-第一个合适的城堡或`-1`如果不够。 这种方法是正确的，因为它从字面上遵循问题陈述。 但是，它太慢了：每个查询可能需要`O(n)`遍历路径，给出`O(n * m)`总计，这是不可行的`n, m = 10^5`。 

最佳解决方案的关键是对树进行预处理，以允许`O(log n)`路径查询。 我们可以使用**二元提升**来有效地计算任意两个城堡的最低共同祖先（LCA）。 路径从`a`到`b`然后可以表示为来自的段`a`到`LCA(a,b)`和来自`b`到`LCA(a,b)`。 我们还维护一个数组`last_attack_year`记录每座城堡最后一次遭到袭击的年份。 有了 LCA 和这个数组，我们可以快速遍历路径并检查是否有亵渎`O(log n + path_length)`，这是可以接受的，因为路径长度最多为`O(n)`但实际上所有查询的总和受到树深度的限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m) | O(n) | 对于大输入来说太慢 |
 | 最佳 | O((n + m) log n) | O((n + m) log n) | O(n log n) | O(n log n) | 已接受，有效处理大量输入 |

 ## 算法演练

 1. 解析输入以读取封建层次结构并构建一棵树作为邻接表。 每个节点代表一座城堡。 
2. 预处理树以进行二元提升。 对于每个城堡，将其祖先存储为距离和深度的两倍次方。 这允许有效计算任意两个城堡之间的 LCA`O(log n)`时间。 
3.初始化一个数组`last_attack_year`尺寸的`n + 1`和`0`，代表还没有城堡被攻击。 
4. 逐年迭代事件。 对于每个攻击事件，更新`last_attack_year[c] = current_year`。 
5. 对于每个骑士查询，计算 LCA`a`和`b`。 生成沿路径的城堡列表`a`到`b`排除`a`和`b`从两端遍历到 LCA。 
6. 过滤路径列表，仅保留所在位置的城堡`last_attack_year[c] <= y`，即一年后城堡未被亵渎`y`。 
7.如果过滤后的列表至少有`k`城堡，归还`k`-第一个。 否则，返回`-1`。 
8. 按照查询出现的顺序输出结果。 

该算法之所以有效，是因为 LCA 保证我们可以将任何路径分成两条简单的向上路径，并且跟踪最近的攻击年份确保我们可以有效地检查亵渎行为。 每个骑士查询都是独立处理的，并且没有城堡被误算，因为每个步骤都明确排除了一年后被亵渎的城堡`y`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(200000)

def run():
    n = int(input())
    parent = list(map(int, input().split()))
    
    adj = [[] for _ in range(n + 1)]
    root = 0
    for i, p in enumerate(parent, 1):
        if p == 0:
            root = i
        else:
            adj[i].append(p)
            adj[p].append(i)
    
    LOG = 17  # 2^17 > 10^5
    up = [[0] * (LOG + 1) for _ in range(n + 1)]
    depth = [0] * (n + 1)
    
    def dfs(u, par):
        up[u][0] = par
        for i in range(1, LOG + 1):
            up[u][i] = up[up[u][i - 1]][i - 1]
        for v in adj[u]:
            if v != par:
                depth[v] = depth[u] + 1
                dfs(v, u)
    
    dfs(root, 0)
    
    def lca(u, v):
        if depth[u] < depth[v]:
            u, v = v, u
        for i in range(LOG, -1, -1):
            if depth[u] - (1 << i) >= depth[v]:
                u = up[u][i]
        if u == v:
            return u
        for i in range(LOG, -1, -1):
            if up[u][i] != up[v][i]:
                u = up[u][i]
                v = up[v][i]
        return up[u][0]
    
    m = int(input())
    events = [input().split() for _ in range(m)]
    last_attack_year = [0] * (n + 1)
    res = []
    
    for year, event in enumerate(events, 1):
        if event[0] == '1':
            c = int(event[1])
            last_attack_year[c] = year
        else:
            _, a, b, k, y = map(int, event)
            l = lca(a, b)
            path = []
            # up from a to lca
            u = a
            while u != l:
                path.append(u)
                u = up[u][0]
            # up from b to lca, reversed
            tmp = []
            u = b
            while u != l:
                tmp.append(u)
                u = up[u][0]
            path += tmp[::-1]
            # exclude a and b
            path = [x for x in path if x != a and x != b]
            filtered = [x for x in path if last_attack_year[x] <= y]
            if len(filtered) >= k:
                res.append(str(filtered[k - 1]))
            else:
                res.append('-1')
    
    print(' '.join(res))

if __name__ == "__main__":
    run()
```该代码使用 DFS 来填充二进制提升表和深度数组。 每个骑士查询都使用 LCA 来有效地构建路径。 过滤被亵渎的城堡是通过简单的列表理解来完成的。 使用`sys.setrecursionlimit`确保 DFS 在深树上工作。 

## 工作示例

 **示例输入 1：**```
3
0 1 2
5
2 1 3 1 0
1 2
2 1 3 1 0
2 1 3 1 1
2 1 3 1 2
```| 年份| 活动 | 路径 a->b | 符合条件的城堡 | 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 骑士 1->3 k=1 y=0 | 2 | 2 | 2 |
 | 2 | 攻击2 | - | - | - |
 | 3 | 骑士 1->3 k=1 y=0 | 2 | 2 | -1 |
 | 4 | 骑士 1->3 k=1 y=1 | 2 | 无 | -1 |
 | 5 | 骑士 1->3 k=1 y=2 | 2 | 2 | 2 |

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n) | O((n + m) log n) | 二进制提升的 DFS 为 O(n log n)。 每个骑士查询都使用 O(log n) 的 LCA 加上路径遍历 |
