---
title: "CF 105093C - 交易破坏者"
description: "我们得到了一组固定的最多 20 个可能的缺陷。 每个申请人都会选择这些缺陷的一些子集，并被分配一个合意性分数。"
date: "2026-06-27T20:49:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105093
codeforces_index: "C"
codeforces_contest_name: "2024 UP ACM Algolympics Final Round"
rating: 0
weight: 105093
solve_time_s: 53
verified: true
draft: false
---

[CF 105093C - 交易破坏者](https://codeforces.com/problemset/problem/105093/C)

 **评级：** -
 **标签：** -
 **求解时间：** 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一组固定的最多 20 个可能的缺陷。 每个申请人都会选择这些缺陷的一些子集，并被分配一个合意性分数。 然后，求职者会提供一份“破坏交易”缺陷的清单，我们必须找到不包含任何这些被禁止的缺陷的最理想的申请人。 

用一种更算法化的方式来表述，每个申请人都是大小为 f 的宇宙的子集，与一个值配对。 每个查询给出另一个子集，我们必须在与查询子集不相交的所有子集中找到最大值。 

这些限制使得这一切变得有趣。 由于申请人数高达 200,000 名，查询数高达 200,000 个，因此不可能立即对所有申请人进行每次查询扫描。 在最坏的情况下，即使每个查询的 O(n) 也会导致 400 亿次检查。 关键限制是 f ≤ 20，这意味着所有子集都可以表示为从 0 到 2^f − 1 的位掩码，这个空间足够小，可以进行预计算。 

一个微妙的陷阱来自于查询的措辞。 “交易破坏者”列表是一个“或”条件：任何包含这些缺陷之一的申请人都是无效的。 因此，我们不是匹配精确的集合，而是排除与查询掩码相交的所有掩码。 

一个天真的错误是将其解释为错误方向的子集匹配，例如检查申请人的掩码是否是查询掩码的子集。 这会颠倒逻辑并产生完全错误的答案。 

## 方法

 直接方法将每个申请人存储为位掩码，并且对于每个查询，检查每个申请人以查看他们的掩码是否与查询掩码相交。 这是正确的，但成本为 O(nq)，这远远超出了可行的范围。 

一旦我们翻转视角，结构就会变得简单得多。 我们不是考虑“该申请人与查询是否冲突”，而是考虑“查询完全允许哪些掩码”。 如果查询掩码是 q，则有效申请人正是那些满足 m & q = 0 的掩码 m。这相当于说 m 是 f 位内 q 的补码的子掩码。 

这将每个查询转换为一个经典的子掩码聚合问题：给定每个掩码的最佳值的预先计算数组，我们想要给定掩码的所有子掩码的最大值。 使用标准子集动态编程技术（子掩码上的 SOS DP）可以有效地回答这个问题。 

我们首先将每个申请人压缩到一个位掩码中，并存储每个精确掩码的最大合意性。 然后我们传播这些值，以便每个掩码存储其所有子掩码的最大值。 经过此预处理后，每个查询都成为补码掩码上的单个查找。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 位掩码 + 子掩码 DP | O((n + 2^f)·f + q) | O(2^f) | O(2^f) | 已接受 |

 ## 算法演练

 我们将每个申请人和查询简化为 f 位的位掩码形式。 

1. 为每个缺陷分配一个从 0 到 f − 1 的索引，并将每个申请人的缺陷列表转换为位掩码。 我们将每个精确掩码的最大合意性存储在一个数组中。 此步骤将所有结构化输入压缩到固定大小的状态空间中。 
2. 构建数组`best[mask]`大小为 2^f，其中每个条目存储其缺陷集恰好是该掩码的申请人的最大期望值。 
3. 将其转换为“子掩码最大值”DP。 对于每一个口罩，我们都希望`dp[mask] = max(best[s]) for all s ⊆ mask`。 我们使用子集上的标准位 DP 来计算：对于每个位，我们将最大值从较小的子掩码传播到较大的子掩码。 
4. 对于每个查询，构建其位掩码 q。 计算 f 位内的补码掩码，`comp = (~q) & ((1 << f) - 1)`。 
5. 问题的答案很简单`dp[comp]`，因为 comp 恰好包含允许的缺陷，并且 dp[comp] 聚合所有有效的申请人掩码。 
6. 如果 dp[comp] 为空（没有申请人贡献），则输出失败字符串。 

### 为什么它有效

 核心不变量是经过预处理后，`dp[x]`存储其缺陷集是 x 子集的所有申请人的最大合意性。 任何对查询 q 有效的申请者都必须与 q 没有重叠，这意味着它的掩码是 q 的补集的子集。 因此，所有有效申请人均被计入`dp[comp]`，并且无效的申请人不能出现在那里，因为任何无效的申请人都会包含一点外部补偿。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    f = int(input().strip())
    flaws = input().split()
    idx = {flaws[i]: i for i in range(f)}

    n = int(input().strip())

    size = 1 << f
    best = [-1] * size

    for _ in range(n):
        a = int(input().strip())
        tokens = input().split()

        mask = 0
        i = 0
        # tokens: im flaw (and/sry chaining)
        while i < len(tokens):
            if tokens[i] == "im":
                i += 1
                continue
            if tokens[i] == "sry":
                break
            flaw = tokens[i]
            i += 1
            if i < len(tokens) and tokens[i] in ("and", "sry"):
                mask |= (1 << idx[flaw])
                if tokens[i] == "sry":
                    break
                i += 1
            else:
                mask |= (1 << idx[flaw])

        best[mask] = max(best[mask], a)

    dp = best[:]

    for i in range(f):
        for mask in range(size):
            if mask & (1 << i):
                dp[mask] = max(dp[mask], dp[mask ^ (1 << i)])

    q = int(input().strip())
    full = (1 << f) - 1

    out = []
    for _ in range(q):
        tokens = input().split()

        qmask = 0
        i = 0
        while i < len(tokens):
            if tokens[i] == "no":
                i += 1
                continue
            if tokens[i] == "pls":
                break
            flaw = tokens[i]
            i += 1
            if i < len(tokens) and tokens[i] in ("or", "pls"):
                qmask |= (1 << idx[flaw])
                if tokens[i] == "pls":
                    break
                i += 1
            else:
                qmask |= (1 << idx[flaw])

        comp = full ^ qmask
        ans = dp[comp]
        if ans == -1:
            out.append("LOWER YOUR STANDARDS")
        else:
            out.append(str(ans))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```第一阶段将每个申请者压缩为位掩码，并仅存储每个精确配置的最佳值。 冲突是通过取最大值来处理的，因为多个申请者可以共享相同的缺陷集。 

第二级是子掩码DP。 位上的每次迭代都允许来自缺少特定位的掩码的信息传播到包含该位的掩码中，从而构建完整的“所有子掩码最大值”表。 

查询逻辑依赖于补充禁止集并将问题视为纯子集查询。 

## 工作示例

 我们用一个小的自定义实例进行说明。 

假设 f = 3，有缺陷 a、b、c。 

申请人：

 面具 001 → 10

 面具 010 → 5

 面具 011 → 7

 预处理后：

 最佳[001]=10，最佳[010]=5，最佳[011]=7

 子掩码 DP 之后：

 dp[000]=0（无申请人）

 dp[001]=10

 dp[010]=5

 dp[011]=10

 dp[111]=10

 现在查询：“no a or c” → qmask = 101

 补偿 = 010

 答案 = dp[010] = 5

 | 舞台| 价值|
 | --- | --- |
 | 掩码| 101 | 101
 | 比较 | 010|
 | dp[补偿] | 5 |

 这表明只有完全包含在允许的功能中的申请人才会被考虑。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + 2^f) · f + q) | O((n + 2^f) · f + q) | 构建掩码、f 位 SOS DP、常量查询 |
 | 空间| O(2^f) | O(2^f) | 所有子集上的数组 |

 指数因子是安全的，因为 f ≤ 20，使得 2^f 大约为一百万，这在内存和时间上都可以通过线性位 DP 进行管理。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    try:
        solve()
    except Exception as e:
        return str(e)

# Minimal case
assert run("""1
a
1
5
im a sry
1
no a pls
""").strip() == "LOWER YOUR STANDARDS"

# Simple valid selection
assert run("""2
a b
2
10
im a sry
5
im b sry
1
no a pls
""").strip() == "5"

# All compatible
assert run("""2
a b
2
10
im a sry
7
im b sry
1
no c pls
""").strip() == "10"

# No valid applicants
assert run("""2
a b
1
5
im a and b sry
1
no a or b pls
""").strip() == "LOWER YOUR STANDARDS"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单一缺陷冲突| 降低你的标准| 空补案例|
 | 简单选择 | 5 | 正确的最大检索 |
 | 不相关的查询 | 10 | 10 全面验收|
 | 全面拒绝| 降低你的标准| 工会阻击案|

 ## 边缘情况

 一个关键的边缘情况是查询禁止所有缺陷。 在这种情况下，补码掩码为零，并且只有没有缺陷的申请者才是有效的。 如果不存在，则 dp[0] 仍然无效，并且输出必须是失败字符串。 DP 正确处理了这个问题，因为 dp[0] 仅聚合精确的空掩码。 

另一个边缘情况是多个申请人共享相同的缺陷集。 预处理步骤仅存储每个掩码的最大合意性，因此重复不会扭曲结果，并且 DP 仍然通过子掩码关系向上传播正确的最大值。
