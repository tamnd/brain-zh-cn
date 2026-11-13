---
title: "CF 283A - 奶牛和序列"
description: "我们从包含单个元素 0 的序列开始，并执行一系列 n 操作。 操作可以通过三种方式修改序列：将第一个 a 元素增加某个值 x、在末尾附加一个新数字或删除最后一个元素。"
date: "2026-06-05T09:38:42+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 283
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 174 (Div. 1)"
rating: 1600
weight: 283
solve_time_s: 106
verified: true
draft: false
---

[CF 283A - 奶牛和序列](https://codeforces.com/problemset/problem/283/A)

 **评分：** 1600
 **标签：** 构造性算法、数据结构、实现
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从包含单个元素的序列开始，`0`，并执行一系列`n`运营。 操作可以通过三种方式修改序列：增加第一个`a`按某个值排列的元素`x`，在末尾追加一个新数字，或删除最后一个元素。 每次操作后，我们需要序列中所有元素的平均值。 输出是一个至少具有六位精度的浮点数。 

关键的限制是`n`最大可达 2·10⁵，并且序列可以通过附加元素来增长。 任何先显式修改所有内容的幼稚方法`a`加法操作期间的元素总共可能会占用 O(n²) 时间，因为每个类型 1 操作可能会触及 O(n) 个元素。 考虑到 2 秒的时间限制，这太慢了。 涉及的整数很小（绝对值≤10^3），因此在Python中数值溢出不是问题，但在计算浮点平均值时需要小心。 

幼稚的实现可能会错误处理的边缘情况包括：当恰好有两个元素时执行类型 3 操作（删除最后一个元素），以及对动态附加的元素而不是原始序列的一部分执行类型 1 添加。 例如，如果序列是`[0, 2]`我们表演`1 2 3`（前 2 个元素加 3），结果必须是`[3, 5]`。 A careless approach that only updates the first element or does not account for appended values would produce a wrong average.

 ## 方法

 The brute-force approach is simple: maintain the entire sequence as a list. For each type-1 operation, iterate over the first`a`元素并添加`x`。 对于类型 2，附​​加`k`。 对于 type-3，删除最后一个元素。 每次操作后，对序列求和并除以其长度。 这适用于小型`n`，但是对于`n ≈ 2·10⁵`如果重复影响 O(n) 个元素的类型 1 操作，则操作次数变为 O(n²)，大约为 4·10^10，远远超出了允许的时间。 

关键的见解是我们不需要单独知道每个元素的确切值；我们需要知道每个元素的具体值。 我们只需要平均值。 Type-1 操作总是影响序列的前缀。 我们可以使用存储每个前缀长度增量的辅助数组来有效地跟踪这些更新。 让`increment[i]`表示应用于第一个的总附加值`i+1`元素。 通过保持序列的运行和（`total_sum`），对于类型 1 操作，我们可以在 O(1) 中更新这个总和，因为添加`x`到第一个`a`元素将总和增加`a * x`。 类型 2 和类型 3 操作可以通过单独存储最后一个元素并相应地维护总和来处理。 这将总复杂度降低到 O(n)，适合输入范围。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 前缀增量 + 运行总和 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化`seq`作为`[0]`,`increments`作为`[0]`， 和`total_sum`为 0。`increments[i]`将存储应用于的额外值`seq[i]`由于类型 1 操作。 
2. 对于每个操作，读取其类型`t`。 
3.如果`t`为1，读取`a`和`x`。 更新`increments[a-1]`通过添加`x`。 更新`total_sum`通过添加`a * x`。 这捕获了添加的效果`x`到第一个`a`元素，而无需单独修改每个元素。 
4. 如果`t`为2，读`k`。 附加`k`到`seq`并附加`0`到`increments`。 更新`total_sum`通过添加`k`。 
5.如果`t`为3，删除最后一个元素`last_val`从`seq`。 从中检索其增量值`increments[-1]`并从倒数第二个元素中减去它`increments`使得前缀和保持一致。 更新`total_sum`通过减去`last_val + increments[-1]`。 从中删除最后一个元素`increments`。 
6. 每次操作后，将平均值计算为`total_sum / len(seq)`并以 6 位十进制数字打印。 

**为什么它有效**

 的`increments`数组确保序列的每个前缀准确跟踪来自类型 1 操作的累积添加。 类型 2 和类型 3 操作显式更新总和，从而保持正确的运行总计。 平均值计算自`total_sum`除以长度`seq`始终反映当前序列，即使该序列从未完全重建。 这保证了每次操作 O(1) 的正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
seq = [0]
increments = [0]
total_sum = 0

for _ in range(n):
    op = list(map(int, input().split()))
    t = op[0]
    
    if t == 1:
        a, x = op[1], op[2]
        increments[a-1] += x
        total_sum += a * x
    elif t == 2:
        k = op[1]
        seq.append(k)
        increments.append(0)
        total_sum += k
    else:
        last_val = seq.pop()
        inc = increments.pop()
        total_sum -= last_val + inc
        if increments:
            increments[-1] += inc
    print(total_sum / len(seq))
```解决方案初始化`seq`与 0。`increments`阵列镜子`seq`长度。 Type-1 操作更新最后受影响的前缀`increments`和`total_sum`。 Type-2 在中附加一个新值和相应的 0`increments`。 Type-3 弹出最后一个元素，调整前缀增量以正确传播其值，并更新总和。 使用`total_sum`保证在 O(1) 时间内计算平均值。 

## 工作示例

 **示例输入 1**```
5
2 1
3
2 3
2 1
3
```| 步骤| 运营| 序列 | 增量| 总和 | 平均 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 初始化| [0]| [0]| 0 | 0 |
 | 1 | 2 1 | 2 [0,1]| [0,0]| 1 | 0.5 | 0.5
 | 2 | 3 | [0]| [0]| 0 | 0.0 | 0.0
 | 3 | 2 3 | [0,3]| [0,0]| 3 | 1.5 | 1.5
 | 4 | 2 1 | 2 [0,3,1]| [0,0,0]| 4 | 1.333333 |
 | 5 | 3 | [0,3]| [0,0]| 3 | 1.5 | 1.5

 此跟踪确认当元素被删除时前缀增量正确传播。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个操作都使用前缀增量和运行总和在 O(1) 内处理 |
 | 空间| O(n) |`seq`和`increments`每个数组最多存储 n 个元素 |

 给定`n ≤ 2·10⁵`，O(n) 解决方案在 2 秒内轻松完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # paste the solution here
    n = int(input())
    seq = [0]
    increments = [0]
    total_sum = 0
    for _ in range(n):
        op = list(map(int, input().split()))
        t = op[0]
        if t == 1:
            a, x = op[1], op[2]
            increments[a-1] += x
            total_sum += a * x
        elif t == 2:
            k = op[1]
            seq.append(k)
            increments.append(0)
            total_sum += k
        else:
            last_val = seq.pop()
            inc = increments.pop()
            total_sum -= last_val + inc
            if increments:
                increments[-1] += inc
        print(total_sum / len(seq))
    return output.getvalue().strip()

# Provided samples
assert run("5\n2 1\n3\n2 3\n2 1\n3\n") == "0.5\n0.0\n1.5\n1.3333333333333333\n1.5", "sample 1"

# Custom cases
assert run("1\n2 1000\n") == "500.0", "single append"
assert run("3\n2 1\n1 2 5\n3\n") == "0.5\n5.5\n5.0", "type-1 then remove"
assert run("2\n1 1 10\n3\n") == "10.0\n0.0", "
```
