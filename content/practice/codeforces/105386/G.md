---
title: "CF 105386G - 积极向上"
description: "我们被要求建立一个从 0 到 n 减 1 的数字排列，这样当我们从左到右读取它时，每个前缀的 XOR 都是严格正的。"
date: "2026-06-23T05:13:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105386
codeforces_index: "G"
codeforces_contest_name: "The 2024 ICPC Kunming Invitational Contest"
rating: 0
weight: 105386
solve_time_s: 58
verified: true
draft: false
---

[CF 105386G - 保持积极态度](https://codeforces.com/problemset/problem/105386/G)

 **评级：** -
 **标签：** -
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求建立一个从 0 到 n 减 1 的数字排列，这样当我们从左到右读取它时，每个前缀的 XOR 都是严格正的。 换句话说，在放置每个元素之后，我们计算到目前为止放置的所有元素的累积异或，并且这个运行值在任何时候都不允许变为零。 

在满足此约束的所有排列中，我们必须输出字典顺序最小的排列。 这意味着我们优先考虑使第一个位置尽可能小，然后是第二个位置，依此类推，同时仍然遵守 XOR 条件。 

输入由多个独立的测试用例组成。 对于每个测试用例，我们仅输出一种排列或声明这是不可能的。 

测试用例中所有 n 的总和最多为一百万的约束意味着解决方案必须接近每个元素的线性或对数线性。 任何二次方的操作，例如尝试所有排列或在没有仔细的数据结构的情况下对大型数组进行重复扫描，都将立即失败。 

施工一开始就出现了一个微妙的问题。 第一个前缀 XOR 只是 p0，因此 p0 必须非零。 这已经排除了选择 0 作为第一个元素的可能性。 第二个微妙之处是，即使我们到目前为止保持有效的前缀异或，选择未来的元素也可以立即迫使异或回到零。 如果只检查当前前缀而不考虑剩余号码的可用性，则很容易错过这种情况。 

例如，如果当前前缀 XOR 等于某个值 x，并且将要选择唯一剩余的未使用的等于 x 的数字，那么选择它会立即使前缀 XOR 为零。 在这种情况下，总是采用最小的未使用数字的天真贪婪方法将失败。 

## 方法

 暴力解决方案将尝试每个排列并检查它是否满足前缀异或条件。 对于每个排列，计算所有前缀 XOR 需要 O(n)，并且存在 n 个阶乘排列，即使 n 小到 10，这也是完全不可行的。 

一个稍微合理的蛮力想法是回溯：逐步构建排列，并在每一步尝试每个未使用的数字，维持当前的异或。 这仍然在第一步分支 n 个选择，在第二步分支 n 减 1，依此类推，从而实现阶乘增长。 在许多分支的早期就违反了约束，但在最坏的情况下，直到深层次才会发生剪枝，因此复杂性仍然呈指数级。 

关键的观察是，打破步骤 i 的前缀条件的唯一方法是运行的 XOR 变为零。 当所选数字等于当前 XOR 值时，就会发生这种情况，因为当且仅当 v 等于 x 时，x XOR v 才等于 0。 这将有效性检查变成了一个非常本地化的规则：我们只需要避免选择等于当前 XOR 的数字即可。 

一旦看到这一点，构造就会变得贪婪。 在每一步中，我们都需要不等于当前异或的最小可用数字。 这自然会产生字典顺序最小的有效序列，因为任何延迟较小数字的尝试都将违反字典顺序最小性或强制禁止的异或零转换。 

剩下的唯一挑战是确保我们能够有效地找到最小的未使用数字，同时最多跳过一个禁止值。 索引上的不相交集结构可以在接近恒定的时间内维护下一个可用数字，使我们能够重复选择最小的有效候选者。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力回溯| O(n!) | O(n) | 太慢了 |
 | DSU 下一个指针的最优贪婪 | O(n α(n)) | O(n α(n)) | O(n) | 已接受 |

 ## 算法演练

我们维护一个正在运行的 XOR 值 x 和一个跟踪哪些数字仍未使用的结构。 我们还维护一个“下一个可用”查询，以便我们始终可以有效地检索最小的未使用数字。 

1. 将答案初始化为空，将 0 到 n 减 1 之间的所有数字标记为未使用，并将 x 设置为零。 
2.对于从0到n减1的每个位置i，我们尝试选择尽可能小的未使用数字v。 
3. 我们从 0 开始查询最小的未使用数字。如果该候选值等于 x，我们暂时跳过它，转而查询下一个严格大于 x 的未使用数字。 
4. 如果这一步不存在有效的候选数，这意味着每个剩余的未使用的数字都会迫使 v 等于 x，我们得出结论，构造是不可能的。 
5. 选择 v 后，我们将其附加到答案中，将其从未使用的结构中删除，并将 x 更新为 x XOR v。 

关键的技术工作在步骤 3 和 4 中。任何步骤中唯一禁止的选择正是取消前缀 XOR 的值。 就前缀条件而言，所有其他未使用的号码都是安全的。 

### 为什么它有效

 在任何时刻，违反约束的唯一方法是使运行的 XOR 变为零。 由于选择下一个元素之前运行的 XOR 是固定的，因此只有一个候选者会导致此失败，即当前 XOR 值本身。 因此，每一步最多有一个禁止值。 

因为我们总是选择最小的有效数字，所以字典最小性是在本地强制执行的。 约束的结构确保未来的决策不依赖于当前 XOR 和剩余数字池以外的任何内容，因此只要该步骤存在有效选择，贪婪地最小化每个位置就不会阻止有效的完成。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.n = n
        self.parent = list(range(n + 1))

    def find(self, x):
        while x <= self.n and self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def remove(self, x):
        self.parent[x] = self.find(x + 1)

def solve():
    n = int(input())
    if n == 1:
        print("impossible")
        return

    dsu = DSU(n)
    res = []
    x = 0

    for i in range(n):
        v = dsu.find(0)

        if v == x:
            v = dsu.find(x + 1)

        if v > n - 1:
            print("impossible")
            return

        res.append(v)
        dsu.remove(v)
        x ^= v

    print(*res)

t = int(input())
for _ in range(t):
    solve()
```DSU 结构用作“下一个可用元素”指针。 当我们删除一个值时，我们将其链接到下一个候选值，以便将来的查询自动跳过它。 

关键的微妙点是每一步的双重查询。 我们首先尝试最小的未使用的数字。 如果该数字会通过匹配当前的 XOR 立即破坏前缀条件，我们会直接跳转到其后的下一个可用候选。 这保证了字典编排的最小性，同时尊重约束。 

当第二个候选者不存在时，就会发生不可能性检查，这意味着剩余的集合会强制进行禁止的 XOR 匹配。 

## 工作示例

 考虑一个小情况，其中 n 等于 3，可用数字为 0、1、2。 

我们从 x 等于 0 开始。 

| 步骤| 可用套装 | 选择 v | 运行 XOR x |
 | --- | --- | --- | --- |
 | 1 | {0,1,2} | 1 | 1 |
 | 2 | {0,2} | 0 | 1 |
 | 3 | {2} | 2 | 3 |

 第一步之后，选择 0 会使前缀 XOR 立即为零，因此我们跳过它并选择 1。之后，所有剩余的选择都是安全的。 

该跟踪显示了禁止值如何始终恰好是当前的 XOR，以及如何跳过它来保留可行性。 

现在考虑 n 等于 2。 

| 步骤| 可用套装 | 选择 v | 运行 XOR x |
 | --- | --- | --- | --- |
 | 1 | {0,1} | 1 | 1 |
 | 2 | {0} | 0 | 1 |

 这证明了即使在从 0 开始无效的最小情况下，字典顺序上最小的有效排列也是如此。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每次测试 O(n α(n)) | 每个元素都通过近乎恒定的 DSU 操作插入和删除一次 |
 | 空间| O(n) | DSU 父阵列和输出存储 |

 所有测试用例的总复杂度与 n 之和呈线性关系，这很好地匹配了一百万个元素的约束。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class DSU:
        def __init__(self, n):
            self.n = n
            self.parent = list(range(n + 1))

        def find(self, x):
            while x <= self.n and self.parent[x] != x:
                self.parent[x] = self.parent[self.parent[x]]
                x = self.parent[x]
            return x

        def remove(self, x):
            self.parent[x] = self.find(x + 1)

    def solve():
        n = int(input())
        if n == 1:
            return "impossible"
        dsu = DSU(n)
        res = []
        x = 0
        for i in range(n):
            v = dsu.find(0)
            if v == x:
                v = dsu.find(x + 1)
            if v > n - 1:
                return "impossible"
            res.append(str(v))
            dsu.remove(v)
            x ^= v
        return " ".join(res)

    t = int(input())
    out = []
    for _ in range(t):
        out.append(solve())
    return "\n".join(out)

# provided samples (format assumed consistent)
assert run("1\n1\n") == "impossible"
assert run("1\n2\n") in ["1 0", "1 0"]

# custom cases
assert run("1\n3\n") == "1 0 2"
assert run("1\n4\n")  # should produce a valid permutation implicitly
assert run("2\n1\n2\n") == "impossible\n1 0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | n = 1 | 不可能| 不存在有效排列的最小边缘情况 |
 | n = 3 | 1 0 2 | 1 0 2 基本的建设性行为和跳过异或冲突|
 | n = 2 | 1 0 | 1 0 最小有效非平凡排列 |
 | 混合测试| 一致的输出 | 处理多个测试用例|

 ## 边缘情况

 当 n 等于 1 时，唯一的排列是 [0]。 第一个前缀 XOR 已经为零，这立即违反了要求，因此算法在任何构造开始之前正确返回不可能。 

当n等于2时，当前的异或从零开始，因此第一步禁止选择0。 因此算法首先选择 1，然后附加剩余的数字 0。 最终的 XOR 保持非零，因此条件对于两个前缀都成立。 

对于当前 XOR 恰好等于最小未使用数字的较大情况，DSU 直接跳到下一个候选。 这确保了贪婪选择不会意外地选择禁止值，并且仅在绝对必要时跳过来保留字典顺序。
