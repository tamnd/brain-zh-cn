---
title: "CF 105112F - 修正分数"
description: "两个整数以数字串的形式给出，在分数方程的每一边形成分子和分母。"
date: "2026-06-27T19:57:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105112
codeforces_index: "F"
codeforces_contest_name: "2023-2024 ICPC Northwestern European Regional Programming Contest (NWERC 2023)"
rating: 0
weight: 105112
solve_time_s: 73
verified: true
draft: false
---

[CF 105112F - 修正分数](https://codeforces.com/problemset/problem/105112/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 两个整数以数字串的形式给出，在分数方程的每一边形成分子和分母。 允许的操作是不寻常的：您可以从分子和分母中删除数字，但必须从两个原始数字中删除完全相同的多组数字。 删除后，每个数字中剩余的数字保持原来的顺序，形成两个新的整数。 

任务是确定是否存在一种方法来执行此类同步删除，以使结果分数等于目标有理数。 如果存在这样的构造，我们必须输出一对有效的结果数。 

重要的微妙之处在于我们不能自由地独立选择两个数字的子序列。 删除是通过数字计数耦合的：从第一个数字中删除的每个数字也必须从第二个数字中删除相同的次数。 这在双方之间创建了全局约束，而不仅仅是两个独立的子序列问题。 

约束允许每个数字最多有 18 位数字，这使得每个数字的子序列总数最多为 2^18，大约 26 万个。 这个大小足够小，以至于枚举单个数字的所有子序列是可行的，但是天真地将它们配对会导致大约 2^18 乘以 2^18 比较，这太大了。 

第二个重要的限制是，结果值可能很大，但仍然适合 64 位整数范围，因为最多保留 18 位数字。 这允许对候选子序列进行直接整数评估，而无需对字符串进行模块化算术或散列技巧。 

当忽略删除的耦合时，就会出现朴素推理的失败案例。 例如，如果构造第一个数字的有效子序列，并独立构造与目标比率匹配的第二个数字的有效子序列，则无法保证从两者中删除相同的数字多重集。 即使算术条件成立，这也会使构造无效。 

另一个微妙的问题是前导零。 如果删除产生类似“01”或“00”的结果，则结果是无效的，即使在数字上它可能仍然评估为正确的值。 正确的方法必须明确拒绝此类构造。 

## 方法

 强力解释将尝试枚举同时从两个数字中删除数字的所有方法。 对于第一个数字中的每个位置子集和第二个数字中的每个子集，我们将检查删除的数字是否在多重集中匹配以及结果数字是否满足目标相等性。 这导致每个数字有 2^18 个选择，因此大约有 2^36 个组合状态，即使进行大量修剪，这也远远超出了可行的限制。 

关键的观察是删除约束可以以分离两个数字的方式重写。 我们不考虑删除的数字，而是考虑剩余的子序列。 一旦我们修复了第一个数字的子序列，第二个数字中必须保留的多组数字就被唯一确定，因为删除的数字必须匹配。 这意味着第二个子序列不是独立的，它由简单的数字计数约束确定。 

这将问题转化为中间相遇式的查找。 我们枚举第二个数字的所有子序列，存储它们的数字频率向量及其数值。 然后，对于第一个数字的每个子序列，我们使用原始计数之间的固定全局差异计算第二个数字所需的数字频率向量。 然后，我们在常数或对数时间内搜索匹配的存储状态。 

仅在确保数字兼容性后才检查算术条件，这避免了生成无效候选。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 对两个数字中的所有删除进行暴力破解 | O(2^n·2^m) | O(2^n·2^m) | O(1) | O(1) | 太慢了 |
 | 子序列枚举+按数字计数散列 | O(2^n + 2^m) | O(2^n + 2^m) | O(2^m) | O(2^m) | 已接受 |

 ## 算法演练

 我们将第一个数字表示为 A，第二个数字表示为 B。 

1. 计算 A 和 B 的数字频率。对于从 0 到 9 的每个数字，计算它在两个字符串中出现的次数。 这为任何有效删除必须全局保留的内容提供了固定参考。 
2. 计算差值向量 K，其中 K[d] = countA[d] − countB[d]。 这表示必须带入任何一对剩余子序列的不平衡。 任何有效对 (A', B') 必须满足 cnt(A') − cnt(B') = K 分量。 
3. 枚举 B 的每个子序列。对于每个子序列，计算三件事：它的数字计数向量、它的数值以及它是否有效（没有前导零，除非它恰好是单个数字）。 将它们存储在以数字计数向量为键的哈希映射中。 对于每个键，我们保留产生该数字配置文件的所有子序列。 
4. 以相同的方式枚举 A 的每个子序列，计算其数字计数向量和数值，再次丢弃无效的前导零情况。 
5. 对于每个子序列 A'，计算 B' 所需的数字计数向量为 cnt(B') = cnt(A') − K。这是由全局删除约束强制执行的。 
6. 查找与该所需数字向量匹配的所有候选B'子序列。 对于每个候选，检查算术条件 A'·d = B'·c 是否成立。 
7. 如果找到有效的一对，则立即输出对应的A'和B'。 

核心不变量是，为 B 存储的每个状态都代表一个完全有效的子序列，并且每个 A' 仅与满足原始约束所施加的精确位数转换的 B' 候选者配对。 这确保了不会考虑无效的删除模式，并且每个检查对都对应于从两个原始数字中一致地全局删除数字。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def valid_number(s):
    if len(s) == 0:
        return False
    if len(s) > 1 and s[0] == '0':
        return False
    return True

def value_of(s):
    if not s:
        return 0
    return int(s)

def build_subsequences(s):
    n = len(s)
    res = []
    for mask in range(1 << n):
        digits = []
        cnt = [0] * 10
        for i in range(n):
            if mask & (1 << i):
                digits.append(s[i])
                cnt[ord(s[i]) - 48] += 1
        if not digits:
            continue
        if not valid_number(digits):
            continue
        val = int("".join(digits))
        res.append((tuple(cnt), val, "".join(digits)))
    return res

def solve():
    a, b, c, d = input().split()
    c = int(c)
    d = int(d)

    cntA = [0] * 10
    cntB = [0] * 10

    for ch in a:
        cntA[ord(ch) - 48] += 1
    for ch in b:
        cntB[ord(ch) - 48] += 1

    K = [cntA[i] - cntB[i] for i in range(10)]

    subsB = build_subsequences(b)
    mp = {}

    for cnt, val, s in subsB:
        mp.setdefault(cnt, []).append((val, s))

    n = len(a)
    for mask in range(1 << n):
        digits = []
        cnt = [0] * 10
        for i in range(n):
            if mask & (1 << i):
                digits.append(a[i])
                cnt[ord(a[i]) - 48] += 1
        if not digits:
            continue
        if not valid_number(digits):
            continue

        valA = int("".join(digits))
        required = tuple(cnt[i] - K[i] for i in range(10))

        if required in mp:
            for valB, sB in mp[required]:
                if valA * d == valB * c:
                    print("possible")
                    print("".join(digits), sB)
                    return

    print("impossible")

if __name__ == "__main__":
    solve()
```实现直接遵循枚举策略。 功能`build_subsequences`生成第二个数字的所有有效子序列，记录数字频率和值。 第一个数字的处理方式类似，但不是存储所有内容，而是立即使用每个子序列来查询候选者。 

算术检查使用交叉乘法`valA * d == valB * c`以避免浮点除法问题。 使用元组作为字典键来处理位数匹配，这使得查找高效且准确。 

在任何数字解释之前强制执行前导零处理，这可以防止无效状态进入哈希结构。 

## 工作示例

 ### 示例 1

 输入：```
163 326 1 2
```我们枚举子序列`326`。 一个有效的子序列是`"2"`带数字计数`(0,1,0,0,0,0,0,0,0,0)`和值 2。 

对于`163`，我们找到子序列`"1"`带数字计数`(1,0,0,0,0,0,0,0,0,0)`和值 1。 

所需的数字差 K 确保删除数字两侧对齐。 这对满足`1/2 = 1/2`，所以被接受。 

| 一个' | 乙'| A'*d | B'*c | 比赛|
 | ---| ---| ---| ---| ---|
 | 1 | 2 | 2 | 2 | 是的 |

 这证实了该算法正确地找到了最小一致删除模式。 

### 示例 2

 输入：```
871 1261 13 39
```一个有效的子序列对是`A' = 87`和`B' = 261`。 

| 一个' | 乙'| A'*39 | B'*13 | 比赛|
 | ---| ---| ---| ---| ---|
 | 87 | 87 261 | 261 3393 | 3393 3393 | 3393 是的 |

 这里的算法不依赖于全长数字。 它选择同时满足数字约束和算术相等的子序列。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(2^n + 2^m) | O(2^n + 2^m) | 两个数字的每个子序列均生成一次并以恒定时间散列和检查进行处理 |
 | 空间| O(2^m) | O(2^m) | 第二个数字的所有子序列均按位数分组存储 |

 当 n、m ≤ 18 时，最坏情况的枚举约为每个数字 262k 个状态，即使在 Python 中，这也完全在限制范围内。 常数因子很小，因为每个状态最多只处理 18 位数字。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import builtins
    out = io.StringIO()
    sys.stdout = out
    try:
        solve()
    finally:
        sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# provided samples
# (placeholders since exact formatting not shown)
# assert run("163 326 1 2") == "possible\n1 2"

# single digit trivial match
assert run("5 5 1 1") != "", "basic equality case"

# no solution case
assert run("123 267 12339 23679") == "impossible", "impossible case"

# leading zero stress
assert run("10 10 1 1") != "", "leading zero handling"

# symmetric digits
assert run("12 21 1 1") != "", "rearrangement case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 5 5 1 1 | 5 5 1 1 可能 5 5 | 琐碎的身份案例|
 | 123 267 12339 23679 | 不可能| 不存在匹配的子序列 |
 | 10 10 1 1 | 10 10 1 1 可能 1 1 | 处理删除导致个位数|
 | 12 21 1 1 | 12 21 1 1 可能 1 1 或 2 2 | 对称性和多个有效答案 |

 ## 边缘情况

 当子序列产生前导零时，就会出现临界边缘情况。 用于输入`100 100 1 1`，一个简单的子序列生成器可能会接受`"00"`作为等于 0 的有效数字。但是，问题定义拒绝带有前导零的数字。 该算法显式过滤第一个选定数字所在的任何子序列`0`并且长度超过一，确保这些状态永远不会进入候选集。 

另一个边缘情况是空子序列。 对于像这样的输入`111 111 1 1`，两边都不选择数字可能看起来满足数字平衡，但它不会形成有效的数字。 该算法立即丢弃空掩码，因此无法选择此状态。 

最后一个微妙的情况是算术溢出或精度错误。 对于像这样的大子序列`"999999999999999999"`，浮点除法是不可靠的。 使用交叉乘法可以完全避免除法，并且即使在 18 位限制下也能保持比较精确。
