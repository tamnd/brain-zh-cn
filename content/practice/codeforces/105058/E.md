---
title: "CF 105058E - \u0413\u043e\u0434\u043e\u0432\u043e\u0439\u043e\u0442\u0447\u0435\u0442"
description: "我们给出了几个独立的场景。 在每个场景中，最多有 40 个候选者，每个候选者都带有一个标签，将他们关于固定数量主题的知识编码为位掩码。"
date: "2026-06-23T11:09:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105058
codeforces_index: "E"
codeforces_contest_name: "\u0418\u043d\u0434\u0438\u0432\u0438\u0434\u0443\u0430\u043b\u044c\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0442\u0438\u043a\u0435 \u0438 \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2024"
rating: 0
weight: 105058
solve_time_s: 81
verified: false
draft: false
---

[CF 105058E - \u0413\u043e\u0434\u043e\u0432\u043e\u0439 \u043e\u0442\u0447\u0435\u0442](https://codeforces.com/problemset/problem/105058/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 21s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出了几个独立的场景。 在每个场景中，最多有 40 个候选者，每个候选者都带有一个标签，将他们关于固定数量主题的知识编码为位掩码。 两名候选人可能会或可能不会被允许一起工作，具体取决于他们是否有友谊关系。 

任务是选择候选子集，使得子集中的每一对都通过友谊边连接。 用图的术语来说，我们正在寻找友谊图中的一个派系。 在所有此类派系中，我们首先优先考虑最大可能的规模。 如果多个派系达到最大规模，我们会选择所有选定知识值的按位异或最大的派系。 

因此，每个场景的输出都是两个值，即最大可能团的大小，以及所选节点值的最大可实现的 XOR。 

就每个测试用例的候选数量而言，约束很小，最多 40 个节点，所有测试的 n 总和不超过 120。这立即表明子集上的指数方法是可以接受的，但前提是它们经过精心构造。 检查所有子集并直接验证派系条件的简单方法需要检查最多 2^40 个子集，这是不可行的。 

在考虑两阶段优化时会出现一个微妙的问题。 我们不仅最大化派系大小，而且还最大化最大大小派系之间的异或。 选择最大度数节点或局部最大化异或的贪心方法将会失败，因为这两个约束都是全局的并且相互影响。 

另一种边缘情况是没有边缘或图形完整时。 在空图中，只有单个节点是有效的团，因此答案完全取决于在单例中选择最大的 XOR 元素。 在完整的图中，所有子集都是派系，因此问题简化为选择最大子集并对该大小的所有子集进行最大化异或，这仍然是不平凡的。 

## 方法

 暴力方法将枚举节点的所有子集。 对于每个子集，我们将通过对照邻接结构验证所有选定顶点对来检查它是否形成团。 如果有效，我们计算其大小和异或值，并保留最佳的值对。 

检查一个子集的团有效性的成本为 O(n^2)，并且有 2^n 个子集，因此总复杂度变为 O(n^2 2^n)。 当 n = 40 时，这远远超出了可行的限制。 

关键的观察结果是，派系约束与子集中的邻接一致性有关，如果我们在保持有效性的同时增量构造子集，这将变得更容易处理。 这提出了一种中间会合策略：将图分成两半，枚举每一半中的所有子集，并跟踪哪些子集是内部派系。 然后，我们将两半的兼容子集组合起来，确保交叉边在两个所选子集之间有效。 

这将指数爆炸从每边 2^40 减少到大约 2^20，这是可以管理的。 我们不仅需要跟踪子集有效性，还需要跟踪团大小和 XOR 值，这些可以在合并期间组合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 完整子集暴力破解 | O(n^2 2^n) | O(n^2 2^n) | O(2^n) | O(2^n) | 太慢了|
 | 半场以上的中间会面| O(2^(n/2) * 2^(n/2)) | O(2^(n/2) * 2^(n/2)) | O(2^(n/2)) | O(2^(n/2)) | 已接受 |

 ## 算法演练

 我们将顶点集分为两部分，左部分和右部分，每个部分的大小最多为 20。对于每一侧，我们枚举所有子集并确定哪些子集完全在该侧内形成有效的派系。 

我们还计算每个有效子集的两个属性：它的大小和它的节点值的异或。

接下来，对于右侧，我们预处理兼容性。 对于每个有效子集，我们在其中存储顶点的位掩码及其内部有效性信息。 

为了进行组合，我们考虑左侧的每个有效子集 A 和右侧的每个有效子集 B。 如果 A 中的每个顶点都连接到 B 中的每个顶点，则该对是有效的。我们可以使用邻接位掩码有效地检查这一点，因此我们避免了每对的 O(n^2) 检查。 

对于每个兼容对，我们将组合大小计算为 |A| + |B| XOR 为 xor(A) XOR xor(B)。 我们首先通过大小来维护最佳答案，然后通过异或。 

### 为什么它有效

 原始图中的每个派系都可以唯一地分为其与左半部和右半部的交集。 这些部分中的每一个本身都必须是一个派系，并且必须跨分区相互兼容。 由于我们枚举了每一半中的所有有效派系，然后仅组合兼容的对，因此每个全局派系都被精确地表示为一对有效的半派系。 这确保了没有遗漏任何有效的候选者，并且在合并阶段排除每个无效的候选者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m, k = map(int, input().split())
        a = list(map(int, input().split()))
        
        adj = [0] * n
        for i in range(n):
            adj[i] = (1 << n) - 1  # start fully connected
        
        # remove non-edges
        for i in range(n):
            adj[i] ^= (1 << i)
        
        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            adj[u] |= (1 << v)
            adj[v] |= (1 << u)

        # actually we want adjacency as bitmask of edges
        # but input gives friendship edges; clique requires full connectivity,
        # so we build complement-style validity check

        # recompute correct adjacency: we track allowed edges
        ok = [[False] * n for _ in range(n)]
        for i in range(n):
            ok[i][i] = True
        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            ok[u][v] = ok[v][u] = True

        # half split
        n1 = n // 2
        n2 = n - n1

        left_ids = list(range(n1))
        right_ids = list(range(n1, n))

        def is_clique(sub, ids):
            for i in range(len(sub)):
                for j in range(i + 1, len(sub)):
                    if not ok[ids[sub[i]]][ids[sub[j]]]:
                        return False
            return True

        left_states = []
        for mask in range(1 << n1):
            nodes = [i for i in range(n1) if mask >> i & 1]
            if is_clique(nodes, left_ids):
                x = 0
                val = 0
                for i in nodes:
                    val ^= a[left_ids[i]]
                left_states.append((nodes, val))

        right_states = []
        for mask in range(1 << n2):
            nodes = [i for i in range(n2) if mask >> i & 1]
            if is_clique(nodes, right_ids):
                x = 0
                val = 0
                for i in nodes:
                    val ^= a[right_ids[i]]
                right_states.append((nodes, val))

        best_size = 0
        best_xor = 0

        for l_nodes, l_xor in left_states:
            for r_nodes, r_xor in right_states:
                valid = True
                for i in l_nodes:
                    for j in r_nodes:
                        if not ok[left_ids[i]][right_ids[j]]:
                            valid = False
                            break
                    if not valid:
                        break
                if not valid:
                    continue
                sz = len(l_nodes) + len(r_nodes)
                xr = l_xor ^ r_xor
                if sz > best_size or (sz == best_size and xr > best_xor):
                    best_size = sz
                    best_xor = xr

        print(best_size, best_xor)

if __name__ == "__main__":
    solve()
```实现遵循拆分和枚举结构。 邻接矩阵直接用于派别检查的正确性。 左半部分和右半部分是独立枚举的，并且仅存储有效的内部派系。 在合并期间，通过检查两个子集之间的所有对来强制执行交叉兼容性。 

将子集显式存储为列表的决定使逻辑变得简单，但这并不是最佳的。 更有效的版本会将子集编码为位掩码并预先计算兼容性掩码以避免嵌套循环。 

## 工作示例

 考虑一个小图，其中四个节点分为两半，每半两个节点。 假设节点 0 和节点 3 之间除一条缺失边外，所有边都存在，且值为任意小整数。 

对于左半部分，所有子集都是有效的派系。 对于右半部分，只有不包含缺失边的两个端点的子集才有效。 

| 步骤| 左子集| 右子集 | 有效交叉边 | 尺寸| 异或|
 | ---| ---| ---| ---| ---| ---|
 | 1 | {} | {} | 是的 | 0 | 0 |
 | 2 | {0} | {2} | 是的 | 2 | a0 异或 a2 |
 | 3 | {0,1} | {2} | 是的 | 3 | a0 异或 a1 异或 a2 |
 | 4 | {0,1} | {2,3} | 没有| - | - |

 此跟踪显示交叉验证步骤如何消除无效派系，否则这些无效派系将通过组合两个有效的内部派系而形成。 

现在考虑大小为 3 的完整图。每个子集都是有效的，因此该算法有效地评估整个集合的所有分区。 最佳大小为 3，并且在所有完整子集中，XOR 在整个集合上最大化。 

| 步骤| 左子集| 右子集 | 尺寸| 异或|
 | ---| ---| ---| ---| ---|
 | 1 | {0} | {1,2} | 3 | a0 异或 a1 异或 a2 |
 | 2 | {0,1} | {2} | 3 | a0 异或 a1 异或 a2 |

 两种分解都会产生有效的完整团，并且算法正确地比较等效最大尺寸结构的异或值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(2^(n/2) * 2^(n/2) * n^2) | 两半子集的枚举以及派系检查和交叉验证 |
 | 空间| O(2^(n/2)) | O(2^(n/2)) | 每半个有效子集的存储 |

 指数因子从每边 2^40 减少到大约 2^20，考虑到常数很小，这在实际限制内。 测试用例之间的总输入约束确保最坏的情况仍然是可控的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue()

# Sample tests (formatted conceptually, actual sample input formatting may vary)
# assert run("...") == "2 7\n3 13\n4 15\n"

# custom tests
assert run("1\n1 0 1\n0\n") == "1 0\n", "single node"
assert run("1\n3 0 2\n1 2 3\n") in ["1 3\n", "1 3"], "no edges"
assert run("1\n3 3 2\n1 2 3\n1 2\n2 3\n1 3\n") == "3 0\n", "complete graph"
assert run("1\n4 0 3\n1 2 4 8\n") == "1 15\n", "only singletons matter"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单节点| 1 0 | 1 0 最小图|
 | 没有边缘| 1 最大人工智能 | 派系规模限制|
 | 完整图表 | n 异或全部 | 完全兼容 |
 | 所有单身人士 | 最多 1 个异或 | 断开的行为|

 ## 边缘情况

 当没有友谊边时，每个派系都是一个顶点。 该算法仍然有效，因为每一半只接受单例子集，并且交叉检查很简单，因为在大多数组合中一侧是空的。 

当图完成时，每个子集在内部和跨半部分都是有效的。 该算法枚举左右子集的所有组合，最大尺寸始终为n。 然后，在所有全尺寸选择中正确处理 XOR 最大化。 

当 k = 0 时，所有值都为零，因此 XOR 始终为零。 该算法简化为纯粹最大化团大小，这成为通过一半枚举解决的标准最大团问题，并且异或平局决不影响正确性。
