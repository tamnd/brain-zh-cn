---
title: "CF 290C - WTF？"
description: "输入不是传统的数学规范。 相反，它是一个用 LOLCODE 编写的小程序。 任务是确定该程序计算什么并打印结果实数。 第一个输入值被读入控制循环的变量中。"
date: "2026-06-05T16:40:26+07:00"
tags: ["codeforces", "competitive-programming", "*special", "graph-matchings", "implementation", "trees"]
categories: ["algorithms"]
codeforces_contest: 290
codeforces_index: "C"
codeforces_contest_name: "April Fools Day Contest 2013"
rating: 1700
weight: 290
solve_time_s: 127
verified: true
draft: false
---

[CF 290C - WTF？](https://codeforces.com/problemset/problem/290/C)

 **评分：** 1700
 **标签：** *特殊、图匹配、实现、树
 **求解时间：** 2m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入不是传统的数学规范。 相反，它是一个用 LOLCODE 编写的小程序。 任务是确定该程序计算什么并打印结果实数。 

第一个输入值被读入控制循环的变量中。 令该值为`n`。 然后程序准确读取`n`附加数字，每个数字之间`0`和`9`。 

在处理序列时，它维护：

 -`FOO`，到目前为止看到的所有值的总和。 
-`BAR`，到目前为止看到的值的数量。 
-`BAZ / QUZ`，代表迄今为止找到的最佳前缀平均值的分数。 

读取每个新值后，程序会比较当前的前缀平均值$$\frac{\text{FOO}}{\text{BAR}}$$与存储的最佳平均值$$\frac{\text{BAZ}}{\text{QUZ}}.$$如果当前平均值至少同样大，则它将替换存储的分数。 

最后，它打印$$\frac{\text{BAZ}}{\text{QUZ}},$$这正是序列中所有前缀的最大平均值。 

自从`n`本身是一个数字，它位于`0`和`9`。 该语句表示输入包含 1 到 10 行，其中一行匹配`n`以及最多九个附加值。 数据量很小，因此即使是二次解也能轻松适应。 真正的挑战是理解程序的作用。 

一个常见的错误是搜索最大个体值而不是最大前缀平均值。 

考虑：```
3
0
1
1
```最大值为`1`，但前缀平均值为：```
0
0.5
0.666667
```正确答案是：```
0.666667
```另一个容易犯的错误是最大化任意子数组而不是前缀的平均值。 

为了：```
3
1
0
9
```子数组`[9]`有平均数`9`，但程序只考虑前缀。 前缀平均值为：```
1
0.5
3.333333
```正确答案是：```
3.333333
```第三个微妙点是分数之间的比较。 原始程序永远不会转换为浮点数。 它比较$$\frac{a}{b} \ge \frac{c}{d}$$通过检查$$a \cdot d \ge c \cdot b.$$在这里使用浮点仍然可以解决这个问题，因为数字很小，但是使用整数运算精确地再现程序会更干净。 

## 方法

 最直接的解释就是从字面上模拟程序。 

我们读取序列，计算每个前缀的平均值，保留迄今为止看到的最大的一个，并在最后打印它。 由于最多有九个值，因此即使存储所有平均值并稍后扫描它们也是微不足道的。 

有趣的部分是了解程序本身如何执行比较。 它不计算实数，而是将最佳平均值存储为分数`BAZ / QUZ`。 当新的前缀与 sum`FOO`和长度`BAR`出现，比较$$\frac{\text{FOO}}{\text{BAR}}$$和$$\frac{\text{BAZ}}{\text{QUZ}}$$使用交叉乘法：$$\text{FOO} \cdot \text{QUZ}$$相对$$\text{BAR} \cdot \text{BAZ}.$$这完全避免了浮点运算。 

在这里，强力思想和最优思想实际上是相同的，因为输入大小非常小。 我们从左到右处理一次前缀，并保持迄今为止最好的平均值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（存储所有前缀平均值）| O(n) | O(n) | 已接受 |
 | 最佳（在线跟踪最佳分数）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取第一个数字`n`。 
2.初始化：

 -`sum_prefix = 0`-`count = 0`-`best_sum = 0`-`best_count = 1`分数`best_sum / best_count`表示迄今为止找到的最佳前缀平均值。 
3. 重复`n`次数：

 - 读取下一个数字`x`。 
- 添加到`sum_prefix`。 
- 增量`count`。 
4. 使用交叉乘法将当前前缀平均值与存储的最佳平均值进行比较：

 - 如果$$\text{sum\_prefix} \cdot \text{best\_count} \ge \text{count} \cdot \text{best\_sum},$$然后更新：

 -`best_sum = sum_prefix`-`best_count = count`这正是 LOLCODE 程序执行的比较。 
5.所有值处理完毕后，输出$$\frac{\text{best\_sum}}{\text{best\_count}}.$$### 为什么它有效

 处理完任何前缀后，该对`(best_sum, best_count)`存储迄今为止看到的所有前缀中最大的前缀平均值。 

最初这是正确的，因为存储的值是`0/1`。 每当处理新的前缀时，我们都会将其平均值与存储的最大值进行比较。 如果它大于或等于，我们将替换存储的分数。 否则我们保留前一个。 通过归纳，在最终迭代之后，存储的分数表示所有前缀的最大平均值，这正是程序打印的内容。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    data = [int(line.strip()) for line in sys.stdin if line.strip()]

    n = data[0]

    prefix_sum = 0
    cnt = 0

    best_sum = 0
    best_cnt = 1

    for x in data[1:1 + n]:
        prefix_sum += x
        cnt += 1

        if prefix_sum * best_cnt >= cnt * best_sum:
            best_sum = prefix_sum
            best_cnt = cnt

    print(best_sum / best_cnt)

if __name__ == "__main__":
    solve()
```第一个值确定有多少个后续数字属于该序列。 读取每个值时，运行总和和前缀长度都会更新。 

关键是比较```
prefix_sum * best_cnt >= cnt * best_sum
```它检查是否$$\frac{\text{prefix\_sum}}{\text{cnt}} \ge \frac{\text{best\_sum}}{\text{best\_cnt}}$$不使用浮点运算。 

仅当当前前缀平均值至少与之前看到的最佳前缀平均值一样大时，才会更新存储的分数。 最后，将存储的分子和分母相除即可生成程序的最终输出。 

## 工作示例

 ### 示例 1

 输入：```
3
0
1
1
```| 步骤| x| 前缀总和 | 碳纳米管| 最佳总和 | 最佳_cnt |
 | ---| ---| ---| ---| ---| ---|
 | 开始| - | 0 | 0 | 0 | 1 |
 | 1 | 0 | 0 | 1 | 0 | 1 |
 | 2 | 1 | 1 | 2 | 1 | 2 |
 | 3 | 1 | 2 | 3 | 2 | 3 |

 最终答案：$$\frac{2}{3}=0.666667$$该迹线显示了存储的分数从`0/1`到`1/2`最后到`2/3`，匹配前缀平均值的递增序列。 

### 示例 2

 输入：```
3
5
0
0
```| 步骤| x| 前缀总和 | 碳纳米管| 最佳总和 | 最佳_cnt |
 | ---| ---| ---| ---| ---| ---|
 | 开始| - | 0 | 0 | 0 | 1 |
 | 1 | 5 | 5 | 1 | 5 | 1 |
 | 2 | 0 | 5 | 2 | 5 | 1 |
 | 3 | 0 | 5 | 3 | 5 | 1 |

 最终答案：$$\frac{5}{1}=5$$第一个前缀已经具有最大平均值。 后来的前缀有平均值`2.5`和`1.666...`，因此存储的分数永远不会改变。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个值都被处理一次 |
 | 空间| O(1) | O(1) | 仅存储少量运行变量 |

 输入大小非常小，但即使对于更大的值，这种线性扫描也是有效的。 内存使用量在整个执行过程中保持不变。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    data = [int(line.strip()) for line in sys.stdin if line.strip()]
    n = data[0]

    prefix_sum = 0
    cnt = 0
    best_sum = 0
    best_cnt = 1

    for x in data[1:1 + n]:
        prefix_sum += x
        cnt += 1

        if prefix_sum * best_cnt >= cnt * best_sum:
            best_sum = prefix_sum
            best_cnt = cnt

    return f"{best_sum / best_cnt}\n"

# provided sample
out = float(run("3\n0\n1\n1\n"))
assert abs(out - 0.666667) < 1e-4

# minimum non-empty sequence
assert run("1\n0\n") == "0.0\n", "single zero"

# single positive value
assert run("1\n9\n") == "9.0\n", "single element"

# best prefix is the first one
assert run("3\n5\n0\n0\n") == "5.0\n", "early maximum"

# all equal values
assert run("4\n7\n7\n7\n7\n") == "7.0\n", "constant average"

# maximum average appears at the end
out = float(run("3\n1\n0\n9\n"))
assert abs(out - (10.0 / 3.0)) < 1e-9
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0`|`0`| 最小的有意义序列 |
 |`1 9`|`9`| 单元素前缀 |
 |`3 5 0 0`|`5`| 最佳前缀立即出现 |
 |`4 7 7 7 7`|`7`| 整个平均水平相同|
 |`3 1 0 9`|`10/3`| 最佳前缀出现在末尾 |

 ## 边缘情况

 考虑输入```
1
0
```只有一个前缀。 处理该值后，存储的分数变为`0/1`，算法输出`0`。 无需特殊处理。 

考虑```
3
5
0
0
```前缀平均值为：```
5
2.5
1.666667
```第一个前缀仍然是最佳的。 叉乘比较正确地拒绝了后面的前缀，因为：$$5 \cdot 1 > 2 \cdot 5$$和$$5 \cdot 1 > 3 \cdot 5.$$考虑```
4
7
7
7
7
```每个前缀平均值等于`7`。 因为程序使用了非严格比较（`>=`），它更新关系上存储的分数。 最终存储的分数变为`28/4`，仍然评估为`7`。 无论保留哪个等平均前缀，输出都保持正确。 

考虑```
3
1
0
9
```最大化任意子数组的解决方案将选择`[9]`并返回`9`，这是错误的。 该算法仅评估前缀：```
1
0.5
3.333333
```并正确返回`10/3`。
