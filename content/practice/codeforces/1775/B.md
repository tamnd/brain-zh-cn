---
title: "CF 1775B - 园丁和阵列"
description: "我们得到一个整数数组，其中每个整数由其 1 位集合而不是其数值指定。 任务是确定数组中是否存在两个不同的子序列产生相同的按位或。"
date: "2026-06-09T11:53:11+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "constructive-algorithms"]
categories: ["algorithms"]
codeforces_contest: 1775
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 843 (Div. 2)"
rating: 1300
weight: 1775
solve_time_s: 111
verified: true
draft: false
---

[CF 1775B - 园丁和阵列](https://codeforces.com/problemset/problem/1775/B)

 **评分：** 1300
 **标签：** 位掩码，构造性算法
 **求解时间：** 1m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组，其中每个整数由其 1 位集合而不是其数值指定。 任务是确定数组中是否存在两个不同的子序列产生相同的按位或。 如果选择的索引集不同，则子序列被认为是不同的，但如果数值不同则不一定。 序列的按位或是任意元素中设置的所有位的组合。 

输入允许最多$10^5$测试用例和总共$10^5$在所有测试中设置所有数字的位。 这意味着每次测试的数组元素数量在总体上受到有效限制，但我们仍然必须考虑单个数组的长度$10^5$。 每次测试的时间差于线性或接近线性的任何算法都会太慢，因为操作总数将超过$10^8$到$10^9$。 枚举所有子序列的简单方法速度呈指数级缓慢且立即不可行。 

当数字具有重叠位，允许子集产生与较大集合相同的 OR 时，或者当单个数字是其他数字的子集时，就会出现不明显的边缘情况。 例如，考虑一个数组$[1, 3]$， 在哪里$1 = 0b1$和$3 = 0b11$。 仅由第一个元素组成的子序列具有 OR$1$，而由两者组成的子序列具有 OR$3$。 如果我们有$[3, 3]$，单独取第一个元素或第二个元素都会产生 OR$3$，产生有效的答案。 仅比较值而不比较索引的简单算法会错误地得出不存在重复子序列的结论。 

## 方法

 暴力方法会尝试枚举所有子序列并计算它们的 OR。 对于长度的数组$n$， 有$2^n$可能的子序列，使得这种方法完全不切实际，即使对于$n$小至$20$。 即使存储所有 OR 结果也会消耗指数级内存，因此这是不可行的。 

关键的见解是将问题简化为以动态、增量的方式检测重复的 OR 值。 我们观察到 OR 运算是单调的：向子序列添加元素不能关闭任何已设置的位。 因此，如果我们跟踪可以形成以每个元素结尾的所有 OR，我们可以通过迭代数组来有效地更新可实现的 OR 集。 每个新元素通过与当前元素进行“或”运算来扩展现有的“或”。 至关重要的是，如果任何 OR 生成多次，我们就会发现两个不同的子序列。 这一观察结果使我们能够将问题简化为基于集合的迭代，其属性是 OR 值只会增加并且永远不会超过数字的位长度，从而使跟踪的 OR 集合保持可管理性。 整数的唯一 OR 值总数，最大可达$2 \cdot 10^5$受位数限制，大约$18$或者$19$，保证了效率。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(2^n) | O(2^n) | 太慢了|
 | 或集传播 | O(n * B) | O(B) | 已接受 |

 ## 算法演练

 1. 初始化一个空集，名为`seen`存储任何子序列中遇到的所有 OR 值。 
2. 按顺序迭代数组元素。 对于每个元素，维护一个集合`current`可以使用以此元素结尾的子序列形成的 OR。 开始`current`与元素本身的值。 
3. 对于每个 OR 值`val`在前一次迭代的集合中，计算`val | element`并将其添加到`current`。 这说明了用当前元素扩展所有先前的子序列。 
4. 计算后`current`，检查每个值`current`反对`seen`。 如果已有任何值`seen`，我们有两个不同的子序列产生相同的 OR，所以答案是“是”。 
5. 否则，将所有值相加`current`到`seen`并继续迭代。 
6. 如果循环结束时没有找到重复的 OR，则答案为“否”。 

不变的是`seen`始终包含迄今为止考虑的所有子序列的所有 OR 值。 由于 OR 是单调的，我们只添加新的 OR。 任何重复项`seen`对应于两个不同的子序列，因为扩展过程保证子序列之间至少有一个不同的索引。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        arr = []
        for _ in range(n):
            parts = list(map(int, input().split()))
            k, bits = parts[0], parts[1:]
            val = 0
            for b in bits:
                val |= 1 << (b-1)
            arr.append(val)
        seen = set()
        prev = set()
        found = False
        for num in arr:
            current = {num}
            for val in prev:
                current.add(val | num)
            for val in current:
                if val in seen:
                    print("Yes")
                    found = True
                    break
            if found:
                break
            seen.update(current)
            prev = current
        if not found:
            print("No")

solve()
```该解决方案使用位移位从输入表示构造整数值。 每个元素都被处理一次。 这`prev`set 存储以前一个元素结尾的所有 OR，并通过与当前数字进行 OR 运算来扩展该元素。 我们立即使用以下方法检测重复的 OR`seen`。 集合的使用可确保有效处理重复项并防止不必要的重新计算。 追踪`prev`单独确保只考虑连续的扩展，避免遗漏任何 OR。 

## 工作示例

 考虑第二个示例输入：```
2
2 1 2
1 2
```单步遍历数组。 初始化`seen = {}`和`prev = {}`。 第一个数字是`0b11`。`current = {0b11}`。`0b11`不在`seen`，所以添加到`seen`。 现在`seen = {0b11}`,`prev = {0b11}`。 下一个号码是`0b10`。`current = {0b10}`加`0b10 | 0b11 = 0b11`。`0b11`已经在`seen`，所以我们打印“是”。 这证实了 OR 值可以在不同的子序列中重复。 

对于第一个示例输入：```
2 1 5
2 2 4
2 2 3
```OR 传播时不会发生冲突。`seen`每一步之后变成`{0b10001}`， 然后`{0b10001,0b1010}`， 然后`{0b10001,0b1010,0b110}`。 没有发生重复，因此输出为“No”。 这演示了非冲突 OR 的正确处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(总 k * B) | 每个或组合处理每个位一次。 k_i总和≤10^5； 每个 OR 最多影响约 18 位。 |
 | 空间| O(B) | 我们存储的 OR 集受到最大元素中位数（大约 18-19）的限制。 |

 即使在最大约束下，该算法也可以在 2 秒限制内轻松运行，因为操作总数与所有 k_i 乘以最大位数的总和成正比，大约为 200 万次操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# Provided samples
assert run("5\n3\n2 1 5\n2 2 4\n2 2 3\n2\n2 1 2\n1 2\n4\n3 1 2 4\n2 2 4\n4 1 2 5 6\n2 2 5\n5\n3 3 1 2\n3 2 5 3\n5 7 2 3 1 4\n5 1 2 6 3 5\n3 2 6 3\n2\n1 1\n1 2\n") == "No\nYes\nYes\nYes\nNo", "provided samples"

# Custom cases
assert run("1\n3\n1 1\n1 2\n1 3\n") == "No", "all single bit, distinct"
assert run("1\n4\n2 1 2\n2 2 3\n2 1 3\n1 1\n") == "Yes", "overlapping ORs"
assert run("1\n2\n1 1\n1 1\n") == "Yes", "duplicate identical numbers"
assert run("1\n1\n1 1\n") == "No", "single element, no subsequence pair"
assert run("1\n3\n2 1 2\n2 3 4\n2 1 2\n") == "Yes", "duplicate OR in non-consecutive elements"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3 个具有不同位的数字 | 没有 | OR 不冲突 |
 | 重叠 OR | 是的 | 正确检测具有相同 OR | 的子序列
 | 重复相同的数字 | 是的 | 正确处理重复元素 |
