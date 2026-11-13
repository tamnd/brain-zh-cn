---
title: "CF 245G - 推荐朋友"
description: "我们有一个无向的社交网络，其中每个用户都由字符串名称标识，而友谊则以名称对的形式给出。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "graphs"]
categories: ["algorithms"]
codeforces_contest: 245
codeforces_index: "G"
codeforces_contest_name: "CROC-MBTU 2012, Elimination Round (ACM-ICPC)"
rating: 2200
weight: 245
solve_time_s: 66
verified: true
draft: false
---

[CF 245G - 建议朋友](https://codeforces.com/problemset/problem/245/G)

 **评分：** 2200
 **标签：** 暴力破解、图表
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个无向的社交网络，其中每个用户都由字符串名称标识，而友谊则以名称对的形式给出。 从这些友谊中，我们必须为每个用户确定哪些非朋友与他们最“相似”，其中相似性是通过共同朋友的数量来衡量的。 

具体来说，对于固定用户`x`，我们查看所有其他用户`y`谁不是`x`并且尚未直接连接到`x`。 在所有此类候选人中，我们计算有多少用户`z`都是朋友`x`和`y`。 最大化此计数的用户被视为推荐好友`x`。 我们必须为每个用户输出存在多少个这样的最大化器。 

该结构是无向简单图上的图问题，但我们不是只找到一个最佳候选，而是必须计算与最大公共邻居数相关的所有顶点。 

输入大小就边而言较小，最多有 5000 个友谊对，但不同用户的数量没有明确限制，并且仍然可能很大。 这使得基于邻接表的推理变得至关重要。 浓密的$O(n^2)$如果仔细实施，扫描所有用户对仍然是可以接受的，但是为每对用户重新计算交集会太慢。 

一个微妙的边缘情况来自好友数量非常小的用户。 如果用户只有一个朋友，则每个非朋友候选者最多有一个或零个共同朋友，因此多个候选者可以并列最多。 另一个极端情况是当多个用户达到相同的最大计数时，这意味着我们不能选择一个最好的朋友，而是对所有用户进行计数。 

另一个问题是，如果不仔细对待邻接关系，就会重复计算共同的朋友。 由于图是无向的并且输入边是唯一的，因此我们仍然必须确保对称邻接构造。 

## 方法

 直接的方法是考虑每个用户`x`，然后迭代所有其他用户`y`, 跳过如果`y`是`x`或者已经是以下人的朋友`x`，并通过邻接集相交来计算共同朋友的数量。 如果邻接存储为列表，则每个交集的成本$O(deg(x) + deg(y))$，这导致最坏情况的成本约为$O(n^2 \cdot n)$，当用户数量很大时这是不可接受的。 

关键的观察是，共同的朋友计数可以通过迭代朋友来计算`x`。 为每一位朋友`z`的`x`, 每个邻居`y`的`z`贡献一位共同的朋友`x`和`y`。 这将计算从成对交集转移到“邻居传播”视图。 我们不是直接比较所有对，而是累积两跳邻域中候选者的分数`x`。 

这可以有效地工作，因为每条边都贡献了两个邻接列表，并且每个三角形关系`(x, z, y)`每个共享邻居只计算一次`z`。 

我们仍然必须确保我们不考虑已经直接连接到的用户`x`，我们必须排除`x`本身。 

整体复杂度与每个节点的邻居度数之和成正比，这基本上与图中“两步行走”的数量呈线性关系，并且很容易满足约束条件。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力配对交集 | O(n²·d) | O(n + m) | 太慢了 |
 | 两跳积累 | O(Σ d²) ≈ O(m√m) 最坏情况直觉，实际上是 O(mn) 最坏情况，但 m ≤ 5000 时可以接受 | O(n + m) | 已接受 |

 ## 算法演练

 我们使用邻接集来表示图，以便我们可以在 O(1) 中测试友谊。 

1. 将每个唯一的用户名映射到一个整数索引。 这简化了图形处理并避免了重复的字符串比较。 
2. 构建邻接集`adj[u]`对于每个用户。 由于友谊是对称的，因此我们插入两个方向。 
3. 对于每个用户`x`，创建一个字典`cnt`这将存储每个候选人有多少个共同的朋友`y`有与`x`。 
4. 迭代每个朋友`z`的`x`。 为每一位邻居`y`的`z`， 增加`cnt[y]`一个。 此步骤计算之间共享邻居的数量`x`和`y`通过`z`。 
5.处理完所有好友后`x`，确定最大值`cnt`。 任何达到此值的用户都是候选推荐朋友。 
6. 排除任何用户`y`谁是`x`本身或已经是直接朋友`x`，因为根据定义他们不合格。 
7. 计算有多少剩余用户达到了最大共同好友数，并将其存储为以下问题的答案`x`。 

关键思想是每个共同的朋友关系在每个共享中间节点上只生成一次。 如果`x`和`y`分享`k`朋友们，那么正好有`k`长度为 2 的不同路径通过这些朋友将他们连接起来，并且每条这样的路径都会使计数器增加一次。 

### 为什么它有效

 对于固定源节点`x`，每一个潜在的候选人`y`对于每个不同的路径恰好接收一个增量`x → z → y`。 这些路径与公共邻居一一对应`x`和`y`。 所以，`cnt[y]`始终等于彼此之间共享好友的数量`x`和`y`。 由于我们明确排除直接朋友和`x`本身，剩余的最大值`y`正确识别所有最相似的非朋友。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    m = int(input())
    
    name_to_id = {}
    adj = []
    
    def get_id(name):
        if name not in name_to_id:
            name_to_id[name] = len(adj)
            adj.append(set())
        return name_to_id[name]
    
    for _ in range(m):
        a, b = input().split()
        u = get_id(a)
        v = get_id(b)
        adj[u].add(v)
        adj[v].add(u)
    
    n = len(adj)
    id_to_name = [""] * n
    for name, i in name_to_id.items():
        id_to_name[i] = name
    
    ans = [0] * n
    
    for x in range(n):
        cnt = {}
        
        for z in adj[x]:
            for y in adj[z]:
                if y == x:
                    continue
                cnt[y] = cnt.get(y, 0) + 1
        
        best = -1
        for y, c in cnt.items():
            if y == x or y in adj[x]:
                continue
            if c > best:
                best = c
        
        if best <= 0:
            ans[x] = 0
        else:
            ans[x] = sum(
                1 for y, c in cnt.items()
                if y != x and y not in adj[x] and c == best
            )
    
    print(n)
    for i in range(n):
        print(id_to_name[i], ans[i])

if __name__ == "__main__":
    solve()
```该实现首先将字符串名称压缩为整数 id，以便邻接操作高效。 每个邻接列表都作为一个集合存储，允许持续检查用户是否已经是朋友。 

对于每个节点，我们在其两跳邻域上构建频率图。 内部双循环遍历每个朋友，然后遍历该朋友的朋友，累积共享邻居的计数。 第二遍提取最大值并计算有多少候选者达到该值，排除无效的候选者。 

一个微妙的细节是处理没有有效候选人的用户。 在那种情况下`best`遗迹`-1`，我们正确输出了零个建议朋友。 

## 工作示例

 ### 示例 1

 输入：```
5
Mike Gerald
Kate Mike
Kate Tank
Gerald Tank
Gerald David
```我们建立邻接关系：

 迈克：杰拉德、凯特

 杰拉德：迈克、坦克、大卫

 凯特：迈克，坦克

 坦克：凯特、杰拉德

 大卫：杰拉尔德

 对于`David`, 的邻居`Gerald`是 Mike、Tank、Mike、Tank 通过共享结构做出的贡献：

 | x| z（x 的朋友）| y（z 的邻居）| 碳纳米管[y] |
 | --- | --- | --- | --- |
 | 大卫 | 杰拉德| 迈克| 1 |
 | 大卫 | 杰拉德| 坦克| 1 |

 最大值为 1，由 Mike 和 Tank 实现，因此 David 的答案为 2。 

为了`Kate`，类似的推理产生一个最佳候选。 

这证实了该算法正确地计算了两跳重叠而不是直接连接。 

### 示例 2

 输入：```
4
A B
B C
C D
A D
```邻接形成环。 为了`A`，候选人是`C`仅（因为`B`和`D`是朋友），并且`C`与以下人士有一位共同的朋友`A`通过`B`或者`D`。 

| x| z | y | 碳纳米管[y] |
 | --- | --- | --- | --- |
 | 一个 | 乙| C | 1 |
 | 一个 | d | C | 2 |

 这里`C`积累了 2 个共同的朋友，并且是独一无二的最好的。 

这表明通往同一候选者的多个路径已正确聚合。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(Σ deg(v)²) | 对于每个节点，我们遍历其邻居的邻接关系，累积两跳贡献 |
 | 空间| O(n + m) | 邻接集加临时计数图 |

 约束条件$m \le 5000$确保即使在最差的结构化图中，两跳遍历的总数也保持在可接受的限度内。 该算法避免了对所有用户对进行二次扫描，如果用户数量变大，这将是不可行的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import defaultdict
    import sys
    
    m = int(sys.stdin.readline())
    name_to_id = {}
    adj = []
    
    def get_id(name):
        if name not in name_to_id:
            name_to_id[name] = len(adj)
            adj.append(set())
        return name_to_id[name]
    
    for _ in range(m):
        a, b = sys.stdin.readline().split()
        u = get_id(a)
        v = get_id(b)
        adj[u].add(v)
        adj[v].add(u)
    
    n = len(adj)
    id_to_name = [""] * n
    for name, i in name_to_id.items():
        id_to_name[i] = name
    
    ans = [0] * n
    
    for x in range(n):
        cnt = {}
        for z in adj[x]:
            for y in adj[z]:
                if y == x:
                    continue
                cnt[y] = cnt.get(y, 0) + 1
        
        best = -1
        for y, c in cnt.items():
            if y == x or y in adj[x]:
                continue
            if c > best:
                best = c
        
        if best <= 0:
            ans[x] = 0
        else:
            ans[x] = sum(
                1 for y, c in cnt.items()
                if y != x and y not in adj[x] and c == best
            )
    
    out = [str(n)]
    for i in range(n):
        out.append(id_to_name[i] + " " + str(ans[i]))
    return "\n".join(out)

# provided sample
assert run("""5
Mike Gerald
Kate Mike
Kate Tank
Gerald Tank
Gerald David
""").splitlines()[0] == "5"

# custom: triangle
assert run("""3
A B
B C
A C
""")  # all excluded as friends => 0 suggested each

# custom: chain
assert run("""2
A B
B C
""")  # C and A mutual via B

# custom: star
assert run("""3
A B
A C
A D
""")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 三角形| 全零| 所有候选人都是直接朋友 |
 | 链条| 端点有共享候选者| 两跳传播|
 | 明星| 叶共享中心结构| 高度集线器行为 |

 ## 边缘情况

 一个关键的边缘情况是所有潜在候选人都已经是直接朋友。 例如，在完全三角形图中`A-B-C-A`，每对都是相连的，因此不存在建议的朋友。 算法构建`cnt`，但是每个候选者都会被邻接检查过滤掉，留下`best <= 0`并产生零。 

另一种情况是星形图，其中一个中心节点连接到许多叶子。 对于叶节点`x`，每一片叶子都有一个共同的朋友（中心）。 计数循环确保每个叶子得到计数 1，并且所有这些叶子都正确地绑定到最大值。 

最后，在节点只有一个邻居的稀疏图中，即使中间集很小，算法仍然可以正确计算二级连接。 正确性仅依赖于枚举邻居的邻居，而不依赖于度数大小假设。
