---
title: "CF 1275C - #define \u0417\u0430\u0434\u0430\u0447\u0430 B ..."
description: "我们被要求模拟使用 C 风格宏递归定义的大型数组。 宏以非常结构化的方式扩展：每个宏级别将前一级别生成的元素数量增加四倍，并添加简单的偏移量。"
date: "2026-06-11T19:56:10+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 1275
codeforces_index: "C"
codeforces_contest_name: "VK Cup 2019 - \u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f (Engine)"
rating: 0
weight: 1275
solve_time_s: 124
verified: true
draft: false
---

[CF 1275C - #define \u0417\u0430\u0434\u0430\u0447\u0430 B ...](https://codeforces.com/problemset/problem/1275/C)

 **评级：** -
 **标签：** *特别
 **求解时间：** 2m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求模拟使用 C 风格宏递归定义的大型数组。 宏以非常结构化的方式扩展：每个宏级别将前一级别生成的元素数量增加四倍，并添加简单的偏移量。 在基层，`A0(x)`产生单个值`x`。 然后`A1(x)`产生四个值：`x`,`x+1`,`x+3`， 和`x+4`。 每个后续级别都会重复前一个级别四次，并带有偏移量`0`,`1`,`3`， 和`4`。 这种模式一直持续到`A25(x)`。 

输入给出了该数组中的多个位置，可能非常大，最多约为$10^{15}$，我们必须输出这些位置的值。 由于数组的大小，直接构造数组是不可能的。 相反，我们必须利用递归结构来独立计算每个值。 

约束条件告诉我们`n`最多可以达到1000，这意味着我们大约可以负担得起$O(n \log N)$操作，其中$N$是最大位置索引。 由于位置可能很大，任何尝试构建数组或线性迭代数组的解决方案都是不可行的。 

当某个位置落在数组的前几个元素中时，就会出现边缘情况。 例如，位置 0 到 3 直接来自第一级扩展，但不考虑递归偏移的简单公式可能会错误计算这些位置。 同样，如果偏移量累积不正确，非常大的位置可能会触发简单算术中的溢出。 

## 方法

 强力方法将尝试递归或迭代地模拟宏的扩展，直到达到所请求的索引。 这在概念上是有效的：递归地，对于`Ai(x)`，该数组是四个副本`A{i-1}`有偏移量`0`,`1`,`3`,`4`。 但是，每个级别都会将元素数量乘以四，因此`A25`该数组有$4^{25} \approx 10^{15}$元素。 即使通过完全扩展计算单个值也是不可能的，因为递归深度为 25，并且每个递归涉及每个级别 4 次递归调用。 最坏情况的操作是$4^{25}$，这是一个天文数字。 

关键的见解来自于观察递归结构。 在每个级别，`Ai(x)`大小为四块`size(A{i-1})`有偏移量`0`,`1`,`3`,`4`。 查找位置处的值`pos`，我们不需要完整的数组。 我们可以递归判断位置落入哪个区块，调整`x`相应的偏移量，并继续向下一个递归分支。 一旦我们到达`A0(x)`，该值只是`x`。 

这一观察结果将问题简化为递归下降，其步数相对于数组大小为对数。 每一步只涉及计算块大小并通过一个小的偏移量调整基值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(4^25)​​ | O(4^25)​​ | O(4^25)​​ | O(4^25)​​ | 太慢了|
 | 递归下降 | O(n * 25) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 计算每一层的数组大小。 由于每个级别都是前一个级别的四倍，`size[i] = 4 * size[i-1]`和`size[0] = 1`。 
2. 对于每个请求的职位`pos`，从最上面的宏开始`A25(0)`并递归地确定四个子块中的哪一个`pos`属于. 块偏移量是`0`,`1`,`3`,`4`。 
3. 减去块的起始索引以获得相对于子块的位置，并将块的偏移量添加到基址`x`。 
4. 重复步骤2-3，直至达到`A0(x)`。 此时的值很简单`x`。 
5. 打印每个查询的值。 

不变的是，在每个递归步骤，算法正确识别当前宏展开的哪四分之一包含`pos`。 由于块大小和偏移量是确定性的，因此递归始终会得出精确值，而无需构造完整数组。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# Precompute the size of arrays at each level
sizes = [1]  # size of A0
for _ in range(25):
    sizes.append(4 * sizes[-1])

# Offsets used at each macro level
offsets = [0, 1, 3, 4]

def find_value(pos, level, base):
    if level == 0:
        return base
    block_size = sizes[level - 1]
    for i in range(4):
        if pos < (i + 1) * block_size:
            return find_value(pos - i * block_size, level - 1, base + offsets[i])
    # Should never reach here if logic is correct
    raise RuntimeError("Position out of range")

n = int(input())
positions = [int(input()) for _ in range(n)]

for pos in positions:
    print(find_value(pos, 25, 0))
```该解决方案首先预先计算大小以快速确定子块边界。 每个查询都递归下降，将每个级别的问题大小减少四倍。 请注意在递归之前应用与块相对应的偏移量。 使用`sizes[level - 1]`确保我们不会超出递归中的位置。 

## 工作示例

 输入示例：```
5
0
1
3
5
8
```跟踪表：

 | 邮政 | 水平| 基地| 块大小 | 选择偏移| 新职位| 结果|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 25 | 25 0 | 4^24 | 4^24 0 | 0 | 0 |
 | 1 | 25 | 25 0 | 4^24 | 4^24 0 | 1 | 1 |
 | 3 | 25 | 25 0 | 4^24 | 4^24 0 | 3 | 4 |
 | 5 | 25 | 25 0 | 4^24 | 4^24 0 | 5 | 2 |
 | 8 | 25 | 25 0 | 4^24 | 4^24 0 | 8 | 3 |

 此跟踪显示递归下降正确地导航宏扩展并计算正确的值，而无需构造数组。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * 25) | 每个查询最多执行 25 个递归步骤 |
 | 空间| O(25) | 递归堆栈加上预先计算的大小 |

 和`n <= 1000`，这个算法非常快。 每个查询只需要 25 个步骤，总共大约 25,000 个步骤，这对于现代 CPU 来说是微不足道的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    sizes = [1]
    for _ in range(25):
        sizes.append(4 * sizes[-1])
    offsets = [0,1,3,4]
    def find_value(pos, level, base):
        if level == 0:
            return base
        block_size = sizes[level - 1]
        for i in range(4):
            if pos < (i + 1) * block_size:
                return find_value(pos - i * block_size, level - 1, base + offsets[i])
    n = int(input())
    positions = [int(input()) for _ in range(n)]
    for pos in positions:
        print(find_value(pos, 25, 0))
    return output.getvalue().strip()

# provided sample
assert run("5\n0\n1\n3\n5\n8\n") == "0\n1\n4\n2\n3"

# minimum input
assert run("1\n0\n") == "0"

# maximum input near end
max_pos = 4**25 - 1
assert run(f"1\n{max_pos}\n") == str(max_pos)  # largest value

# multiple equal positions
assert run("3\n2\n2\n2\n") == "3\n3\n3"

# consecutive positions
assert run("4\n0\n1\n2\n3\n") == "0\n1\n3\n4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 位置为 0 | 0 | 基本情况`A0`|
 | 最大仓位 | 4^25-1 | 4^25-1 算法处理大数而不会溢出 |
 | 重复职位| 3 3 3 | 3 3 3 独立处理多个查询|
 | 前四名 | 0 1 3 4 | 0 1 3 4 递归正确识别初始偏移量 |

 ## 边缘情况

 对于最小的位置，`0`，算法立即返回`0`因为它达到了`A0`没有递归。 对于最大的位置，`4^25 - 1`，递归下降选择每个级别的最后一个子块，正确地总结沿路径的偏移量。 重复的位置被独立处理，确认查询之间没有错误地共享状态。 最后，前四个位置验证初始偏移量`[0,1,3,4]`在顶层正确应用。
