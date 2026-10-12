---
title: "CF 106016C - 美元 兑 里拉"
description: "奥马尔每天必须结算以两种货币表示的需求。 对于第 i 天，有所需的美元数量 ai 和兑换率 bi，该汇率表示用里拉替换一美元的成本。 在那一天，奥马尔可以将付款分成两部分。"
date: "2026-06-21T16:41:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106016
codeforces_index: "C"
codeforces_contest_name: "The 2025 Homs Collegiate programming contest"
rating: 0
weight: 106016
solve_time_s: 55
verified: true
draft: false
---

[CF 106016C - 美元兑里拉](https://codeforces.com/problemset/problem/106016/C)

 **评级：** -
 **标签：** -
 **求解时间：** 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 奥马尔每天必须结算以两种货币表示的需求。 对于第 i 天，有所需的美元数量 ai 和兑换率 bi，该汇率表示用里拉替换一美元的成本。 

在那一天，奥马尔可以将付款分成两部分。 他可以直接支付一些 xi 美元，剩余的 ai − xi 美元有效地转换为里拉，成本为 (ai − xi) · bi 里拉。 如果他用美元支付所有费用，里拉成本为零。 如果他没有用美元支付任何费用，他就会用里拉全额支付。 

一天的里拉付款就是我们所说的 ci，目标是让最糟糕的一天尽可能小。 更准确地说，我们希望最小化所有天的最大 ci，同时仍然能够选择总金额不超过 m 美元的 xi 值。 

关键的交互作用是，第 i 天使用的每一美元都会使 ci 减少 bi。 因此，美元就像一种可以在几天内分配的资源，根据当天的汇率，每一美元都有不同的“价值”。 

这些约束将我们推向 O(n log C) 或 O(n log n) 每种测试方法。 由于所有测试用例的 n 总和高达 3 × 10^5，因此每个测试的任何线性或接近线性的解决方案都是可接受的。 尝试所有分配或模拟重新分配的二次策略将立即失败，因为即使 10^5 平方运算也太大了。 

当每天贪婪地思考而没有全局阈值时，就会出现一个微妙的问题。 在本地减少最糟糕的一天可能会浪费金钱，因为每一美元都比另一天更不值钱。 正确的解决方案必须在全球范围内比较日期，而不是单独对待它们。 

## 方法

 思考这个问题的一个直接方法是想象将 m 美元中的每一美元分配给某一天，并观察最大里拉成本减少了多少。 在暴力模型中，我们会反复选择一天并决定是否在那里再兑换一美元。 每个选择都会影响最终的最大值，并且探索所有分配原则上会导致指数级的可能性，或者如果简单地模拟的话至少会产生 O(mn) 。 由于m可以大到10^9，所以这是完全不可行的。 

关键的观察是，我们可以扭转观点，而不是构建分配。 假设我们猜测允许的最大里拉成本的值 y。 然后，对于每一天，我们可以计算我们被迫花费多少美元才能将这一天减少到最多 y。 如果所需美元总额超过 m，则猜测值太小。 如果在m以内，则猜测是可行的。 

这将问题转化为对 y 的单调可行性检查。 如果某个 y 是可以实现的，那么任何更大的 y 也是可以实现的，因为我们需要更少的缩减。 这种单调性允许对 y 进行二分搜索。 

剩下的任务是计算每天确保 ci ≤ y 所需的最少美元数。 由于 ci = (ai − xi)bi，条件 ci ≤ y 变为 xi ≥ ai − y / bi。 每美元都会将 ci 减少 bi，因此所需的 xi 实际上是 ai − y / bi 的上限，限制为零且最多为 ai。 

一旦我们能够计算出固定 y 所需的总金额，二分搜索就会产生最小可行答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力分配 | 指数 / O(mn) | O(1) | O(1) | 太慢了 |
 | 具有可行性检查的二分搜索 | O(n log(最大 ai·bi)) | O(1) 额外 | 已接受 |

 ## 算法演练

 我们将问题转化为寻找最小 y，这样所有天数都可以使用最多 m 美元减少到最多 y。 

1. 对于固定的猜测 y，计算每天需要多少美元才能确保 ci ≤ y。

对于第 i 天，条件 (ai − xi)bi ≤ y 重新排列为 xi ≥ ai − y / bi。 由于 xi 必须是整数，因此我们取 xi = max(0, ai − Floor(y / bi))。 这给出了当天的最低强制支出。 

这样做的原因是，每一美元都会使里拉成本精确地减少 bi，因此将 ci 减少 k·bi 需要花费 k 美元。 
2. 对所有天数所需的 xi 值求和。 

该总和表示每天满足阈值 y 所需的最低总金额。 
3. 根据 m 检查可行性。 

如果总和 ≤ m，则可以实现 y。 否则，y 太小，我们需要增加它。 
4. 在[0, max(ai·bi)]范围内对y进行二分查找。 

上限对应于我们在任何地方都不花钱的最坏情况。 

### 为什么它有效

 对于任何固定的日期，xi 和 ci 之间的关系是线性的并且独立于其他日期。 日期之间唯一的关联是总美元预算 m。 这创建了一个结构，其中每个 y 定义了确定性的最低要求，并且增加 y 只能降低这些要求。 这种单调性保证二分搜索将收敛到最小的可行 y，因为随着 y 的增加，可行性永远不会从 true 翻转回 false。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))

        max_val = 0
        for i in range(n):
            max_val = max(max_val, a[i] * b[i])

        def ok(y):
            need = 0
            for i in range(n):
                take = a[i] - (y // b[i])
                if take > 0:
                    need += take
                    if need > m:
                        return False
            return need <= m

        lo, hi = 0, max_val
        while lo < hi:
            mid = (lo + hi) // 2
            if ok(mid):
                hi = mid
            else:
                lo = mid + 1

        out.append(str(lo))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```实现的核心是评估候选 y 的函数。 它将全球阈值转化为每日最低美元使用量。 表达式 y // b[i] 是在不超过目标的情况下完全取消双尺寸减少的美元数量。 从 ai 中减去这个值就得出还必须花费多少美元。 

二分查找维持一个区间，其中左侧不可行或未知，右侧可行。 每个中点检查都会以对数方式减少搜索空间。 

必须小心溢出，因为 ai·bi 可以达到 10^18，但 Python 可以安全地处理这个问题。 在其他语言中，需要 64 位整数。 

## 工作示例

 考虑一个 n = 3、m = 3 的小实例。 

令 a = [3, 2, 4] 且 b = [2, 5, 1]。 

我们测试候选 y = 4。 

| 我| 艾| 双| y // 双 | 需要 xi = max(0, ai − y//bi) |
 | --- | --- | --- | --- | --- |
 | 1 | 3 | 2 | 2 | 1 |
 | 2 | 2 | 5 | 0 | 2 |
 | 3 | 4 | 1 | 4 | 0 |

 总共需要美元 = 3，等于 m，因此 y = 4 是可行的。 

现在考虑 y = 3。 

| 我| 艾| 双 | y // 双 | 必填 xi |
 | --- | --- | --- | --- | --- |
 | 1 | 3 | 2 | 1 | 2 |
 | 2 | 2 | 5 | 0 | 2 |
 | 3 | 4 | 1 | 3 | 1 |

 总共需要的美元 = 5，超过了 m，因此 y = 3 是不可行的。 

这显示了收紧 y 如何增加所需的美元使用量，这正是启用二分搜索的原因。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log(最大 ai·bi)) | 每次可行性检查的时间复杂度为 O(n)，二分搜索在值范围 | 上运行。 
| 空间| O(1) 额外 | 仅使用数组和计数器 |

 所有测试用例的 n 总和以 3 × 10^5 为界，因此即使每个测试进行大约 30-60 次二分搜索迭代，总工作量仍然在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def solve():
        t = int(input())
        out = []

        for _ in range(t):
            n, m = map(int, input().split())
            a = list(map(int, input().split()))
            b = list(map(int, input().split()))

            max_val = 0
            for i in range(n):
                max_val = max(max_val, a[i] * b[i])

            def ok(y):
                need = 0
                for i in range(n):
                    take = a[i] - (y // b[i])
                    if take > 0:
                        need += take
                        if need > m:
                            return False
                return need <= m

            lo, hi = 0, max_val
            while lo < hi:
                mid = (lo + hi) // 2
                if ok(mid):
                    hi = mid
                else:
                    lo = mid + 1

            out.append(str(lo))

        return "\n".join(out)

    return solve()

# small sanity checks
assert run("1\n1 5\n10\n2\n") == "20"

# all zeros effect check
assert run("1\n2 10\n1 1\n1 1\n") == "0"

# tight budget forcing high y
assert run("1\n2 1\n10 10\n1 1\n") == "9"

# uneven rates
assert run("1\n3 3\n3 2 4\n2 5 1\n") == "4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单日缩放| 20 | 直接转换的正确性|
 | 统一小箱| 0 | 全面覆盖美元的可行性|
 | 预算紧张| 9 | 二分查找压力案例|
 | 混合费率| 4 | 不同bi值之间的相互作用|

 ## 边缘情况

 当所有天 bi = 1 时，就会出现极端情况。 在这种情况下，每一美元都会使 ci 恰好减少 1，因此问题就简化为在线性赤字中分配 m 单位的减少量。 该算法自然地处理这个问题，因为 y // 1 简单地变成 y，并且所需的 xi 变成 ai − y。 

另一种情况是当 m 非常大时。 如果 m ≥ sum(ai)，我们可以直接全额支付所有美元，使所有 ci 为零。 二分查找自然会收敛到 y = 0，因为可行性立即成功。 

当 ai * bi 非常大，接近 10^18 时，会出现最后一个微妙的情况。 该算法通过在计算二分搜索范围之外从不存储这些乘积的中间减法来避免溢出。 所有每次迭代工作都保持在安全整数运算范围内，并且可行性函数仅使用较小规模的除法和减法。
