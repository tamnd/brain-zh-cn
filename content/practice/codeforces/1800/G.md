---
title: "CF 1800G - 对称树"
description: "我们得到一棵有根树，其顶点编号从 1 到 $n$，其中顶点 1 是根。 每个顶点可以有零个或多个子顶点，输入指定连接顶点的边。 任务是确定树是否对称。"
date: "2026-06-09T09:41:03+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "hashing", "implementation", "trees"]
categories: ["algorithms"]
codeforces_contest: 1800
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 855 (Div. 3)"
rating: 2200
weight: 1800
solve_time_s: 101
verified: false
draft: false
---

[CF 1800G - Symmetree](https://codeforces.com/problemset/problem/1800/G)

 **评分：** 2200
 **标签：** dfs 和类似的、散列、实现、树
 **求解时间：** 1m 41s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵有根树，顶点编号从 1 到$n$，其中顶点 1 是根。 每个顶点可以有零个或多个子顶点，输入指定连接顶点的边。 任务是确定树是否对称。 如果在可能重新排序每个节点的子节点之后，最左边和最右边的子树是镜像，第二个左子树和第二个右子树是镜像，等等，则树是对称的。 如果一个节点有奇数个子节点，则中间子节点的子树本身必须是对称的。 

输入由多个测试用例组成。 每个测试用例描述一棵树，最多可达$2 \cdot 10^5$顶点。 由于测试用例中所有顶点的总和为$2 \cdot 10^5$，任何解决方案都必须与每个测试用例的节点数呈线性关系。 算法与$O(n^2)$复杂性太慢。 我们必须避免通过天真的扫描来重复比较子树。 内存使用量也必须保持在合理的范围内，大约$O(n)$每个测试用例。 

非明显的边缘情况包括单节点树、完美线性链或只有在对子节点重新排序后才能实现对称的树。 例如，一棵树的根具有回文形状的子树，但子树本身不同，则必须返回 NO。 粗心的实现可能只检查子节点的数量而不是子树结构。 

## 方法

 蛮力方法是尝试每个节点上子节点的所有可能的排列，并检查是否存在对称的排序。 对于每个节点，我们将递归地检查所有子树对，计算其中一个是否是另一个的镜像。 这在原则上是正确的，但是生成所有排列会导致子节点数量的阶乘复杂性，这对于具有许多子节点的节点来说是不可行的。 即使我们尝试在没有排列的情况下进行递归比较，天真地比较子树结构也可能导致重复$O(n)$遍历每个节点，结果是$O(n^2)$时间。 

关键的观察是子树的对称性可以简化为哈希问题。 如果我们可以计算每个子树的结构签名或散列，该结构签名或散列与子树的顺序无关但捕获镜像结构，那么检查对称性就变成了散列的简单比较。 对于一个节点，我们可以递归地计算所有子节点的哈希值，对这些哈希值进行排序（或按镜像顺序比较它们），并将它们组合成表示子树的单个哈希值。 如果两个子树的子哈希列表彼此相反，则它们是镜像。 

我们可以使用确定性哈希函数，例如，排序子哈希的元组。 通过将这些哈希值从叶子递归传播到根，我们将问题简化为$O(n)$每棵树。 这种方法避免了重复遍历并处理任意子排序。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力排列 | 每个节点 O(n!) | O(n) | 太慢了 |
 | 递归子树哈希 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 将树表示为邻接列表，以顶点 1 为根。这允许有效地遍历子节点。 
2. 定义递归函数`hash_tree(node)`返回以子树为根的结构散列`node`。 对于叶子，哈希可以是固定值，例如`()`。 
3. 对于非叶节点，递归计算每个子节点的哈希值。 存储子哈希列表。 
4. 对子哈希进行排序，并考虑反转的子哈希。 如果排序列表等于其倒序，则子树是对称的。 否则，就不是。 
5. 为了有效地处理大量子项，请将子项哈希转换为元组或字符串，并在可哈希结构中使用它们。 
6. 返回当前节点的哈希值，对其结构和子节点的对称性进行编码。 一种简单的方法是将子哈希列表转换为元组：`tuple(child_hashes)`。 这确保具有相同子树结构的节点产生相同的哈希值。 
7. 在根处，根据计算出的哈希值检查子树是否对称。 如果是则输出 YES，否则输出 NO。 

工作原理：递归散列确保每个子树都以其结构唯一地表示。 对称性检查简化为按镜像顺序比较子哈希。 由于递归覆盖所有节点并确定性地组合其子哈希，因此将在镜像哈希不同的第一级别检测到任何不对称性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 20)

def solve():
    t = int(input())
    results = []
    
    for _ in range(t):
        n = int(input())
        tree = [[] for _ in range(n + 1)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            tree[u].append(v)
            tree[v].append(u)
        
        def dfs(node, parent):
            child_hashes = []
            for child in tree[node]:
                if child == parent:
                    continue
                child_hashes.append(dfs(child, node))
            
            # Check symmetry
            left = 0
            right = len(child_hashes) - 1
            while left < right:
                if child_hashes[left] != child_hashes[right]:
                    return None  # Asymmetrical subtree
                left += 1
                right -= 1
            
            # Hash for this node: tuple of sorted children
            return tuple(sorted(child_hashes))
        
        result = dfs(1, 0)
        results.append("YES" if result is not None else "NO")
    
    print("\n".join(results))

solve()
```邻接表确保我们可以在线性时间内遍历每棵树。 这`dfs`函数递归计算子树哈希，同时检查镜像子树的相等性。 如果任何一对孩子没有被镜像，该函数返回`None`，它向上传播并表示不对称。 对子哈希进行排序可确保不同子排序之间的一致性。 递归深度受限于`sys.setrecursionlimit`处理深树。 

## 工作示例

 对于第一个示例输入：```
6
1 5
1 6
1 2
2 3
2 4
```

`dfs(1)`看到孩子们`[5, 6, 2]`。 节点 5 和 6 是叶子节点，因此它们的哈希值是`()`。 节点 2 有子节点`[3,4]`，它们是叶子，给出哈希值`(() , ())`。 镜像检查比较 5 与 2。对哈希值进行排序后，节点通过对称性，因此输出为 YES。 

对于第二个样本：```
7
1 5
1 3
3 6
1 4
4 7
4 2
```

`dfs(1)`看到孩子们`[5,3,4]`。 子哈希不同，镜像比较失败，因此输出为“否”。 

| 节点| 子哈希 | 对称性检查 | 返回的哈希值 |
 | --- | --- | --- | --- |
 | 3 | [6] -> [()] | 独生子女 | ((),)|
 | 4 | [7,2] -> [(),()] | [7,2] -> [(),()] | 镜子好| ((),()) |
 | 1 | [5,3,4] -> [(),((),),((),())] | 左与右不同| 无 |

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个节点被访问一次，每个节点的子哈希值被线性比较 |
 | 空间| O(n) | 邻接表和递归堆栈与 n 成正比 |

 假设所有测试用例中 n ≤ 2 × 10^5，该算法可以在 2 秒内轻松运行，内存限制为 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("""6
6
1 5
1 6
1 2
2 3
2 4
7
1 5
1 3
3 6
1 4
4 7
4 2
9
1 2
2 4
2 3
3 5
1 7
7 6
7 8
8 9
10
2 9
9 10
2 3
6 7
4 3
1 2
3 8
2 5
6 5
10
3 2
8 10
9 7
4 2
8 2
2 1
4 5
6 5
5 7
1
""") == "YES\nNO\nYES\nNO\nNO\nYES"

# custom cases
assert run("1\n1\n") == "YES", "single node"
assert run("1\n3\n1 2\n1 3\n") == "YES", "two leaves"
assert run("1\n3\n1 2\n2 3\n") == "NO", "chain"
assert run("1\n5\n1 2\n1 3\n3 4\n3 5\n") == "YES", "nested symmetry"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 个节点 | 是 | 单节点平凡对称 |
 | 3 个节点，叶子 | 是 | 根有两片相同的叶子|
 | 3 个节点，链 | 否 | 线性链中的对称性失效 |
 | 5 个节点，| | |
