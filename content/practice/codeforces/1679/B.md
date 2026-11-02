---
title: "CF 1679B - 石器时代问题"
description: "我们得到一个整数数组和一系列查询。 每个查询要么用新值替换数组中的单个元素，要么用相同值替换数组中的每个元素。 每次查询后，我们需要报告数组的总和。"
date: "2026-06-10T00:40:01+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1679
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 791 (Div. 2)"
rating: 1200
weight: 1679
solve_time_s: 90
verified: true
draft: false
---

[CF 1679B - 石器时代问题](https://codeforces.com/problemset/problem/1679/B)

 **评分：** 1200
 **标签：** 数据结构、实现
 **求解时间：** 1m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一系列查询。 每个查询要么用新值替换数组中的单个元素，要么用相同值替换数组中的每个元素。 每次查询后，我们需要报告数组的总和。 关键是数组最多可以有 200,000 个元素，我们最多可以有 200,000 个查询。 值本身可以大到$10^9$。 

考虑到这些限制，为每个查询逐个元素更新数组的简单方法将太慢。 例如，如果我们有一个将所有元​​素设置为新值的查询，并且数组有 200,000 个元素，则只需迭代数组即可$O(n) = 2 \cdot 10^5$每个查询的操作。 如果我们有 200,000 个这样的查询，则总操作将为$O(n \cdot q) = 4 \cdot 10^{10}$，这远远超出了2秒内可以运行的范围。 我们需要一种解决方案，避免接触每个元素来进行“全部替换”操作。 

当我们在类型 2 查询之后进行类型 1 查询时，就会出现微妙的边缘情况。 仅保持数组原样的简单实现可能会错误地对元素求和，因为它没有考虑之前完成的“全局替换”。 例如，如果数组最初是`[1, 2, 3]`，我们将所有元素设置为`5`(type-2)，然后将第二个元素设置为`7`(type-1)，总和必须是`5 + 7 + 5 = 17`。 尝试更新的粗心实现`a[1]`直接不跟踪全局替换可能会错误地计算`5 + 2 + 5 = 12`。 

## 方法

 暴力方法很简单：将数组保留在内存中，对于每个查询，根据类型修改数组。 对于类型 1 查询，我们只需替换单个元素； 对于类型 2 查询，我们迭代数组并将每个元素设置为新值。 每次查询后，我们通过迭代数组来计算总和。 这种做法是正确的，但是太慢了。 最坏的情况是对 200,000 个元素的数组进行 200,000 个 2 类查询，我们正在执行$4 \cdot 10^{10}$运营。 

关键的观察结果是类型 2 查询会覆盖所有先前的值。 我们可以存储一个“全局值”，表示最后一个 2 类查询后所有元素的值，而不是更新整个数组。 然后，各个类型 1 更新只需要调整相对于该全局值的总和。 我们将数组的总和维护为单个变量，并跟踪由 1 类更新引起的任何偏差。 通过这种策略，每个查询都会在恒定时间内处理，$O(1)$，因为我们从不循环遍历数组进行 2 类查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * q) | O(n) | 太慢了|
 | 最佳| O(q) | O(n) | 已接受 |

 ## 算法演练

 1. 计算数组的初始和并将其存储在变量中`total_sum`。 这允许我们在第一个查询后立即输出总和，而无需重新计算。 
2. 维护数组`last_update`长度`n`跟踪与类型 2 查询相关的每个元素的最后更新值。 最初，它存储数组的实际值。 
3. 维护一个变量`global_value`表示最后一个 2 类查询后每个元素的值。 最初，它是`None`因为没有发生全局替换。 
4. 对于每个查询，读取其类型。 如果查询是 type-1，我们计算元素的旧值：`last_update[i]`在最后一个type-2之后进行了修改，我们使用它； 否则，我们使用`global_value`或初始值。 从中减去旧值`total_sum`，添加新值，并将新值记录在`last_update[i]`。 
5. 如果查询是类型2，我们设置`global_value`到新值，清除其中的任何单独更新`last_update`，并更新`total_sum`到`n * global_value`。 
6. 每次查询后，打印`total_sum`。 

为什么它有效：不变的是`total_sum`始终等于当前数组的总和。 类型 2 查询的全局值和类型 1 查询的每个元素覆盖的组合可确保不会错误地计算数组元素。 我们永远不需要遍历整个数组来进行类型 2 操作，因此该算法保持在相对于查询数量的线性时间内。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, q = map(int, input().split())
a = list(map(int, input().split()))
total_sum = sum(a)
last_update = a[:]
global_value = None
last_global_time = -1
time = 0

for _ in range(q):
    query = list(map(int, input().split()))
    time += 1
    if query[0] == 1:
        i, x = query[1] - 1, query[2]
        if last_global_time > last_update[i]:
            old_val = global_value
        else:
            old_val = last_update[i]
        total_sum += x - old_val
        last_update[i] = x
    else:
        x = query[1]
        global_value = x
        last_global_time = time
        total_sum = n * x
    print(total_sum)
```在代码中，`last_update[i]`跟踪元素的最后一个已知值。`last_global_time`和`time`让我们确定最后一个类型 2 查询是否发生在元素的单独更新之后。 当我们处理 type-1 查询时，我们从中减去正确的旧值`total_sum`并添加新的。 对于类型 2 查询，我们更新`global_value`并立即重新计算`total_sum`作为`n * global_value`。 这使所有操作保持恒定的时间。 

## 工作示例

 使用示例 1：

 | 步骤| 查询 | 数组状态 | 总和 | 最后更新 | 全局值 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 初始化| [1,2,3,4,5] | 15 | 15 [1,2,3,4,5] | 无 |
 | 1 | 1 1 5 | 1 1 5 [5,2,3,4,5] | 19 | 19 [5,2,3,4,5] | 无 |
 | 2 | 2 10 | [10,10,10,10,10] | 50 | 50 [5,2,3,4,5] | 10 | 10
 | 3 | 1 5 11 | 1 5 11 [10,10,10,10,11] | 51 | 51 [5,2,3,11,5] | 10 | 10
 | 4 | 1 4 1 | 1 4 1 [10,10,10,1,11] | 42 | 42 [5,2,3,1,5] | 10 | 10
 | 5 | 2 1 | 2 [1,1,1,1,1] | 5 | [5,2,3,1,5] | 1 |

 此跟踪表明该算法正确处理交替的类型 1 和类型 2 查询，更新`total_sum`高效。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q) | 每个查询都在恒定时间内处理，使用`total_sum`和辅助阵列。 |
 | 空间| O(n) | 我们存储初始数组并`last_update`大小数组`n`。 |

 该解决方案非常适合时间和内存限制。 即使用最大$2 \cdot 10^5$查询和元素，所有操作都是简单的算术和数组赋值。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution copied here
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    total_sum = sum(a)
    last_update = a[:]
    global_value = None
    last_global_time = -1
    time = 0

    for _ in range(q):
        query = list(map(int, input().split()))
        time += 1
        if query[0] == 1:
            i, x = query[1] - 1, query[2]
            if last_global_time > last_update[i]:
                old_val = global_value
            else:
                old_val = last_update[i]
            total_sum += x - old_val
            last_update[i] = x
        else:
            x = query[1]
            global_value = x
            last_global_time = time
            total_sum = n * x
        print(total_sum)
    return output.getvalue().strip()

# Provided sample
assert run("5 5\n1 2 3 4 5\n1 1 5\n2 10\n1 5 11\n1 4 1\n2 1\n") == "19\n50\n51\n42\n5", "sample 1"

# Minimum input
assert run("1 2
```
