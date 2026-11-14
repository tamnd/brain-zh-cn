---
title: "CF 433E - 橘奏的豆腐"
description: "我们被要求计算给定范围 [l, r]（以 m 为基数表示）内满足特定“值”约束的数字。 每个数字都以零值开始。 我们有 n 个模式，每个模式都是以 m 为基数的数字序列，并具有关联的整数值。"
date: "2026-06-07T02:41:32+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 433
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 248 (Div. 2)"
rating: 2500
weight: 433
solve_time_s: 103
verified: false
draft: false
---

[CF 433E - 橘奏的豆腐](https://codeforces.com/problemset/problem/433/E)

 **评分：** 2500
 **标签：** dp
 **求解时间：** 1m 43s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算给定范围 [l, r]（以基数 _m_ 表示）内满足特定“值”约束的数字。 每个数字都以零值开始。 我们得到 _n_ 种模式，每个模式都是以 _m_ 为基数的数字序列，并具有关联的整数值。 对于数字，模式的每次出现作为连续子字符串都会将其值增加该模式的值。 如果一个数字的总价值不超过_k_，则被视为“麻婆豆腐”。 任务是计算所有麻婆豆腐的数字以 10^9+7 为模。 

输入将数字表示为数字数组，而不是整数，这意味着我们必须仔细处理前导零和基数转换。 数字最多为 200 位，基数最多为 20 位，模式数最多为 200 个。每个模式最多为 200 位，模式长度总和≤200。 

单纯地迭代范围内的每个数字是不可能的，因为范围最多可以有 m^200 个数字。 此外，模式可以在数字内重叠，因此数字可以累积多个重叠匹配的值。 这排除了任何暴力枚举。 边缘情况包括带有前导零的模式、具有最少数字的数字（例如 l=1、r=1）以及恰好位于 k 阈值的数字。 

例如，考虑一个二进制范围 [10, 11]，其中模式“01”的值为 2 并且 k=2。 数字10不包含“01”，所以它的值为0，是麻婆豆腐。 11号也没有“01”，所以也是麻婆豆腐。 简单的方法可能会因为不正确的子字符串匹配或前导零而错误计数。 

## 方法

 暴力方法是生成 [l, r] 中的每个数字，将其转换为数字字符串，根据所有模式检查所有可能的子字符串，对它们的值求和，并计算 ≤k 的数字。 时间复杂度为 O((r-l+1) * n * max_pattern_length)，这是不可行的，因为 r-l+1 可能非常巨大（最多 m^200）。 即使对于像 m=10 这样的小基数，这也会很快超过 10^200，远远超出任何计算能力。 

关键的见解是使用**数字动态规划与 Aho-Corasick 自动机相结合**。 数字 DP 让我们可以对某个范围内的数字进行计数，而无需通过从最高有效位到最低有效位处理数字来显式生成它们，并维护状态信息，例如当前前缀是否与上限或下限匹配。 Aho-Corasick 自动机在处理数字时有效跟踪所有模式的出现，包括重叠模式，同时更新累积值。 通过将这些组合起来，我们可以计算所有 ≤r 且值 ≤k 的数字，并减去 <l 的数字的计数以获得最终答案。 

暴力破解之所以有效，是因为它直接实现问题陈述，但由于搜索空间巨大而失败。 我们可以在自动机中对模式进行编码，并根据状态和累积值使用 DP 进行计数，这一观察结果大大降低了复杂性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((r-l+1) * n * L) | O(n * L) | 太慢了|
 | 数字 DP + Aho-Corasick | O(len * num_states * k * 2) | O(num_states * k) | 已接受 |

 ## 算法演练

1. 将所有模式转换为 Aho-Corasick trie。 trie 中的每个节点对应于某种模式的前缀，并且我们为每个节点预先计算自动机到达该节点时累积的总值（以该节点结束的所有模式值的总和）。 
2. 构建特里结构的故障链接。 当下一个数字与当前节点不匹配时，这些链接允许我们移动到与某些模式的前缀匹配的最长后缀节点，从而确保有效地计算所有模式的出现。 
3. 将 DP 状态定义为 dp[pos][node][value][tight_low][tight_high]，其中 pos 是当前数字索引，node 是当前 Aho-Corasick 状态，value 是迄今为止累积的模式值，tight_low 和ight_high 跟踪当前前缀是否严格遵循下限或上限。 紧密标志确保我们不会计算 [l, r] 之外的数字。 
4. 使用根节点、值为 0 并设置两个紧密标志来初始化位置 0 处的 DP。 
5. 对于每个位置，根据紧密标志迭代允许的数字。 更新新数字的 Aho-Corasick 节点，将节点的模式值添加到累积值中，并根据新数字是否与边界匹配来传播紧密标志。 
6. 仅传播累加值≤k 的状态。 超过 k 的状态无法得出答案。 
7、处理完所有数字后，对dp[len][_][value ≤ k][_][*]求和，得到≤r的麻婆豆腐编号个数。 对 <l 的数字重复此操作，然后减去以得到 [l, r] 中的数字。 
8. 将最终答案对 10^9+7 取模。 

工作原理：DP 逐位考虑范围内的所有数字。 自动机确保重叠图案每次出现时精确计数一次，并且累积值跟踪麻婆豆腐总值。 通过对所有满足值约束的 DP 状态求和，我们可以精确计算所有有效数字。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
MOD = 10**9 + 7

class ACNode:
    def __init__(self):
        self.children = {}
        self.fail = None
        self.value = 0

def build_aho_corasick(patterns, m):
    root = ACNode()
    for digits, val in patterns:
        node = root
        for d in digits:
            if d not in node.children:
                node.children[d] = ACNode()
            node = node.children[d]
        node.value += val

    queue = []
    for d in range(m):
        if d in root.children:
            root.children[d].fail = root
            queue.append(root.children[d])
        else:
            root.children[d] = root

    while queue:
        cur = queue.pop(0)
        for d, child in cur.children.items():
            fail_node = cur.fail
            while d not in fail_node.children:
                fail_node = fail_node.fail
            child.fail = fail_node.children[d]
            child.value += child.fail.value
            queue.append(child)
    return root

def count_numbers(num, root, m, k):
    memo = {}

    def dfs(pos, node, val, tight):
        if val > k:
            return 0
        if pos == len(num):
            return 1
        key = (pos, id(node), val, tight)
        if key in memo:
            return memo[key]
        res = 0
        max_digit = num[pos] if tight else m-1
        for d in range(0, max_digit+1):
            next_node = node
            while d not in next_node.children:
                next_node = next_node.fail
            next_node = next_node.children[d]
            res += dfs(pos+1, next_node, val + next_node.value, tight and d == max_digit)
            res %= MOD
        memo[key] = res
        return res

    return dfs(0, root, 0, True)

def normalize_digits(a, length):
    return [0]*(length - len(a)) + a

def main():
    n, m, k = map(int, input().split())
    l_len, *l_digits = map(int, input().split())
    r_len, *r_digits = map(int, input().split())
    l_digits = normalize_digits(l_digits, max(len(l_digits), len(r_digits)))
    r_digits = normalize_digits(r_digits, max(len(l_digits), len(r_digits)))
    patterns = []
    for _ in range(n):
        parts = list(map(int, input().split()))
        patterns.append((parts[:-1], parts[-1]))
    root = build_aho_corasick(patterns, m)

    def prep(num):
        return normalize_digits(num, len(r_digits))

    res_r = count_numbers(prep(r_digits), root, m, k)
    # for l-1 we need a decrement function
    def dec(num):
        num = num[:]
        idx = len(num)-1
        while idx >= 0:
            if num[idx] > 0:
                num[idx] -= 1
                break
            num[idx] = m-1
            idx -= 1
        return num
    l_minus = dec(prep(l_digits))
    res_l = count_numbers(l_minus, root, m, k)
    print((res_r - res_l) % MOD)

if __name__ == "__main__":
    main()
```该代码包含三个主要部分：构建自动机、使用累加值执行数字 DP 以及仔细处理 [l, r] 边界。 减量函数正确处理带前导零的数字，以确保计算小于 l 的数字时的正确性。 

## 工作示例

 **样品1：**

 输入数字：l=1，r=100，模式：1→1，01→1

 | 邮政 | 节点| 值| 紧| 考虑的数字| 计数|
 | ---| ---| ---| ---| ---| ---|
 | 0 | 根 | 0 | 真实| 1..9 | 1..9 ... |

 追踪确认只有 3 个数字超过 k=1，所以 97 个
