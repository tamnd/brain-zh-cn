---
problem: 959F
contest_id: 959
problem_index: F
name: "Mahmoud and Ehab and yet another xor task"
contest_name: "Codeforces Round 473 (Div. 2)"
rating: 2400
tags: ["bitmasks", "dp", "math", "matrices"]
answer: passed_samples
verified: true
solve_time_s: 71
date: 2026-06-18
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
share_url: https://chatgpt.com/share/6a339f5b-7da0-83ec-9af1-078177c4b240
---

# CF 959F - Mahmoud 和 Ehab 以及另一个异或任务

 **评分：** 2400
 **标签：** 位掩码、dp、数学、矩阵
 **型号：** gpt-5-3-mini
 **求解时间：** 1m 11s
 **已验证：** 是（1/1 样品）
 **分享：** https://chatgpt.com/share/6a339f5b-7da0-83ec-9af1-078177c4b240

 ---

 ## 解决方案

 ## 问题理解

 我们得到一个整数数组，其中每个值都被视为 20 位数字。 对于每个查询，我们只查看数组的前缀，特别是第一个$l$元素，并且我们必须计算该前缀有多少个子序列异或等于目标值$x$。 这里的子序列意味着我们可以独立地获取或跳过每个元素，因此前缀中索引的每个子集都是有效的。 

关键输出不是单个子序列，而是不同子序列的数量，这些子序列的所选元素的异或等于查询值，取模$10^9 + 7$。 

这些约束立即排除了枚举子序列。 数组和查询数量均达到$10^5$，每个元素贡献一个大小的状态空间$2^{20}$因为 XOR 值位于$[0, 2^{20})$。 任何通过重新计算子集 XOR 或什至独立维护每个前缀的显式 DP 来处理每个查询的解决方案都会超出时间限制许多数量级。 

一个微妙的边缘情况是空子序列。 它的 XOR 被定义为零，因此任何要求$x = 0$如果我们考虑前缀，即使没有选择任何元素，也必须包含它。 

另一个重要的极端情况是重复值或零。 例如，如果数组包含许多零，则每个零都会使任何固定 XOR 目标的子序列数量加倍，但仅限于必须通过 DP 转换一致传播的结构化方式。 

## 方法

 直接方法将枚举第一个的所有子序列$l$每个查询的元素。 对于固定长度的前缀$l$， 这是$2^l$，并且跨查询这变得不可能，因为$l$可以是$10^5$。 即使每个查询独立计算 DP 也会花费$O(q \cdot l \cdot 2^{20})$，这远远超出了可行的范围。 

XOR 子集计数问题的标准见解是子集 XOR 的行为类似于 GF(2) 上向量空间上的线性组合。 每个新元素要么不改变可达异或的空间，要么将维度增加一（如果它与当前基线性无关）。 

我们不是直接跟踪所有子集计数，而是维护 XOR 值的线性基础以及全局乘法因子，该全局乘法因子表示有多少不同子集由于依赖元素而合并为相同的 XOR 值。 

关键的结构性事实是，如果当前基础有规模$k$，然后在第一组中$i$元素，确切地说$2^{i-k}$子集对应于基跨度中每个可到达的异或值。 这种一致性使得计数成为可能：跨度中的每个 XOR 值都具有相同数量的生成子集。 

对于查询，我们减少目标异或$x$使用基础。 如果它不可表示，则答案为零。 如果可以表示的话，答案就是$2^{l-k}$， 在哪里$k$是第一个基向量的数量$l$元素。 

为了有效地支持前缀查询，我们增量构建基础并在每个前缀位置存储其大小和结构的快照。 然后每个查询都会得到回答$O(20)$通过减少$x$针对存储的基础。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(q \cdot 2^l)$|$O(1)$| 太慢了 |
 | 最佳|$O((n+q) \cdot 20)$|$O(n \cdot 20)$| 已接受 |

 ## 算法演练

 我们从左到右处理数组，同时保持线性异或基础。 

1. 初始化一个大小为 20 的数组，表示基向量，全部设置为零。 还预先计算两个模的幂$10^9+7$。 
2. 对于每个元素$a_i$，使用标准最高位消除将其插入 XOR 基础中。 如果减少后变为零，则它是相关的并且不会增加基础大小。 
3. 维护基础排名的运行计数$k_i$处理完每个前缀后$i$。 还存储基础快照或至少足够的结构来回答该前缀的缩减。 
4. 查询$(l, x)$,取前缀对应的基$l$并尝试减少$x$通过使用存储的基本向量消除最高位。 
5.如果减少后$x$变为零，答案是$2^{l - k_l}$。 否则，答案为零。 

减少工作的原因是基础代表所有可实现的 XOR 值的跨越集。 如果一个值不能减少到零，则它位于跨度之外，并且不会产生任何子序列。 

### 为什么它有效

 所有子集 XOR 的集合形成了 GF(2) 上的向量空间。 我们维护的基础就是这个空间的基础。 每个子集对应于基向量加上依赖元素选择的线性组合，它们仅相乘计数而不改变可表示的 XOR 值。 由于每个独立元素使子集数量加倍，同时仅在独立时增加维度，因此每个可表示 XOR 的子集数量变得均匀且等于$2^{\text{free dimensions}}$。 这个不变量适用于每个前缀，确保所有查询的正确答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7
MAXB = 20

def build_powers(n):
    pw = [1] * (n + 1)
    for i in range(1, n + 1):
        pw[i] = (pw[i - 1] * 2) % MOD
    return pw

def insert_basis(basis, x):
    for b in reversed(range(MAXB)):
        if not (x >> b) & 1:
            continue
        if basis[b]:
            x ^= basis[b]
        else:
            basis[b] = x
            return True
    return False

def reduce_x(basis, x):
    for b in reversed(range(MAXB)):
        if (x >> b) & 1:
            if basis[b]:
                x ^= basis[b]
    return x == 0

def solve():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    basis = [0] * MAXB
    prefix_basis = [None] * (n + 1)
    rank = 0

    prefix_basis[0] = ([0] * MAXB, 0)

    for i in range(1, n + 1):
        new_basis = basis[:]
        before_rank = sum(1 for x in new_basis if x)
        if insert_basis(new_basis, a[i - 1]):
            rank = before_rank + 1
        else:
            rank = before_rank
        basis = new_basis
        prefix_basis[i] = (basis[:], rank)

    pw = build_powers(n)

    out = []
    for _ in range(q):
        l, x = map(int, input().split())
        b, r = prefix_basis[l]
        if reduce_x(b, x):
            out.append(str(pw[l - r]))
        else:
            out.append("0")

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该实现构建了一个前缀线性基础，为每个前缀存储基础向量及其秩。 每个查询都会检索存储的状态并根据该基础减少目标异或。 如果归约成功，答案是 2 的幂，由前缀中存在多少个依赖元素决定。 

一个微妙的实现细节是复制每个前缀的基础。 这确保查询不会干扰以后的更新。 归约步骤必须从高位到低位进行，以匹配规范的基础结构。 

秩计算必须反映独立插入的数量，而不仅仅是基础数组中非零向量的数量，因为基础维护可以在位置之间移动向量。 

## 工作示例

 我们使用带有小数组的简化跟踪。 

输入：```
n = 4, q = 2
a = [1, 2, 3, 0]
queries:
(3, 3)
(4, 1)
```我们跟踪基础插入：

 | 我| 一个[我] | 插入后的基础| 等级 |
 | --- | --- | --- | --- |
 | 1 | 1 | {1} | 1 |
 | 2 | 2 | {1,2} | 2 |
 | 3 | 3 | {1,2}（依赖）| 2 |
 | 4 | 0 | {1,2} | 2 |

 查询(3,3)：使用基{1,2}减少3。 3 = 1 xor 2，可约化为 0，所以答案是$2^{3-2} = 2$。 

查询(4,1)：可以表示1，所以答案是$2^{4-2} = 4$。 

该跟踪显示依赖元素不会增加排名，但子集计数仍然增加。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n+q)\cdot 20)$| 每次插入和查询 XOR 缩减最多涉及 20 位 |
 | 空间|$O(n \cdot 20)$| 碱基的前缀存储 |

 复杂性完全在限制范围内，因为$2 \cdot 10^5 \cdot 20$运营完全在典型限制范围内。 

## 测试用例```python
import sys, io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    MAXB = 20
    def insert(basis, x):
        for b in reversed(range(MAXB)):
            if (x >> b) & 1:
                if basis[b]:
                    x ^= basis[b]
                else:
                    basis[b] = x
                    return True
        return False

    def reduce_x(basis, x):
        for b in reversed(range(MAXB)):
            if (x >> b) & 1:
                if basis[b]:
                    x ^= basis[b]
        return x == 0

    basis = [0] * MAXB
    pref = []
    rank = 0

    pref.append((basis[:], rank))
    for i in range(n):
        nb = basis[:]
        before = sum(1 for v in nb if v)
        if insert(nb, a[i]):
            rank = before + 1
        else:
            rank = before
        basis = nb
        pref.append((basis[:], rank))

    out = []
    for _ in range(q):
        l, x = map(int, input().split())
        b, r = pref[l]
        if reduce_x(b[:], x):
            out.append(str(pow(2, l - r, MOD)))
        else:
            out.append("0")

    return "\n".join(out)

# provided samples
assert run("""5 5
0 1 2 3 4
4 3
2 0
3 7
5 7
5 8
""") == """4
2
0
4
0"""

# custom cases
assert run("""1 3
0
1 0
1 1
1 0
""") == """2
0
2""", "single zero element"

assert run("""3 2
1 2 3
3 0
3 3
""") == """2
2""", "full basis small"

assert run("""4 2
0 0 0 0
4 0
4 1
""") == """16
0""", "all zeros"

assert run("""5 2
1 1 1 1 1
5 1
5 0
""") == """16
16""", "duplicates collapse"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单零元素 | 2 / 0 / 2 | 空子序列处理 |
 | 满基小| 2 / 2 | 2 可表示的 XOR 查询 |
 | 全零| 16 / 0 | 依赖关系呈指数增长 |
 | 重复折叠 | 16 / 16 | 16 重复下的排名稳定性|

 ## 边缘情况

 关键的边缘情况是数组仅包含零。 对于所有前缀来说，基础仍然是空的，因此每个长度的前缀$l$有$2^l$XOR 等于 0 的子序列，所有非零查询都返回零。 该算法可以处理此问题，因为对于非零值，归约失败并且排名保持为零。 

另一种情况是所有元素都是相同的非零值。 第一次插入后，每个后续元素都是相关的。 等级保持为 1，每个前缀都表现为一个二态系统：XOR 为零或该值，计数根据相关插入缩放为 2 的幂。 

最后一个微妙的情况是查询，其中$x = 0$。 即使不存在基向量，归约也会立即成功，答案变为$2^l$，正确计算包括空子集在内的所有子集。
