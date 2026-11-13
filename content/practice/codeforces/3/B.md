---
title: "CF 3B - 卡车"
description: "我们有一辆容量为 v 的卡车。有两种船。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 3
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 3"
rating: 1900
weight: 3
solve_time_s: 245
verified: true
draft: false
---
[CF 3B - 卡车](https://codeforces.com/problemset/problem/3/B)

 **评级：** 1900
 **标签：** 贪心，排序
 **求解时间：** 4m 5s
 **已验证：** 是的

 ## 问题理解

 我们有一辆卡车，容量足够`v`。 有两种船。 

一艘皮划艇占据 1 个单位的空间。 

一艘双体船占据 2 个单位的空间。 

每艘船也都有其价值，即其承载能力。 目标是装载总占用空间不超过卡车体积的一部分船只，同时最大化承载能力的总和。 

输入将所有船只一一给出。 对于每艘船，我们都知道它的类型和价值。 我们必须打印最大总值和一组最佳指数。 

这些约束完全塑造了解决方案。 最多可以有`10^5`船，它立即排除了总体积上任何基于子集的动态规划。 体积本身可以大到`10^9`，所以即使`O(n * v)`is impossible both in time and memory.

 A quadratic solution is also too slow. 和`10^5`物品，甚至`O(n^2)`意思是周围`10^10`操作，远远超出了2秒内所能完成的范围。 我们周围需要一些东西`O(n log n)`。 

棘手的部分是，项目只有两种可能的权重，1 和 2。这种特殊的结构是问题可以贪婪解决的全部原因。 

有几种边缘情况打破了天真的推理。 

假设我们总是先乘坐价值最高的船。 

输入：```
3 2
2 100
1 60
1 60
```按值贪婪选择选择价值为 100 的双体船。 

最优答案是两艘皮划艇，总价值120。 

问题是，选择 2 号物品可能会阻挡两个非常强大的 1 号物品。 

当剩余体积变得奇数时，就会出现另一种危险情况。 

输入：```
4 3
2 100
2 99
1 60
1 50
```乘坐两艘最好的双体船是不可能的，因为总尺寸变为 4。 

乘坐一艘双体船和一艘皮划艇需要 160 美元。 

乘坐三艘皮划艇是不可能的，因为只有两艘。 

单独优化每种类型的粗心实现可能会错过混合解决方案。 

一种更微妙的情况是许多船具有相同的价值。 

输入：```
5 4
1 10
1 10
2 20
2 20
1 10
```存在几个最佳答案。 该算法仍必须输出一组有效的原始索引。 在排序过程中忘记保留索引是一个常见的错误。 

## 方法

 蛮力的想法很简单。 每艘船都可以被乘坐或跳过，因此我们可以迭代所有子集，计算总占用体积和总承载能力，然后保留最佳可行子集。 

这是合乎逻辑的，因为它会检查每个可能的答案。 问题是子集的数量。 和`n = 10^5`，我们需要检查`2^100000`组合，这在天文数字上是不可能的。 

一个更现实的暴力方向是决定我们乘坐多少艘双体船。 一旦这个数字确定了，剩余空间就确定了，我们就可以用皮划艇填充它。 

假设我们按价值降序对所有双体船和所有皮划艇按价值降序排序。 然后对于每一个可能的双体船数量`k`，我们采取最好的`k`双体船和适合剩余空间的最佳数量的皮划艇。 

这已经让人感觉很有希望，因为一旦列表被排序，固定计数的最佳选择始终是具有最大值的前缀。 

关键的观察是项目权重只有 1 和 2。因此，每个可行的解决方案都可以表示为：`some prefix of the sorted size-1 list + some prefix of the sorted size-2 list`没有理由跳过更强的物品而选择相同尺寸的较弱的物品。 

排序后，我们可以预先计算两个组的前缀和。 然后尝试每一种可能的双体船计数就会变得高效。 对于每个`k`，我们知道：

 已用空间=`2 * k`剩余空间=`v - 2 * k`最佳皮艇贡献 = 第一个的前缀和`remaining space`皮划艇

 总值的计算公式为`O(1)`预处理后。 

然后我们重建与最佳分割相对应的索引。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有船只并将其分成两个数组：`ones`用于皮划艇和`twos`对于双体船。 

每个条目都存储值和原始索引，因为输出需要原始编号。 
2. 按承载能力降序对两个数组进行排序。 

排序后，最好的采取方式`k`同类型的船只是拿第一`k`。 
3. 为两个数组构建前缀和。 

让：`pref1[i]`= 最好的总价值`i`皮划艇`pref2[i]`= 最好的总价值`i`双体船

 这使我们能够在恒定的时间内评估任何候选解决方案。 
4. 迭代所乘坐的双体船的数量。 

假设我们采取`k`双体船。 他们所占据的空间是`2 * k`。 

如果这已经超过了卡车的体积，请停止考虑更大的`k`。 
5. 计算剩余容量。 

剩余空间变为：`rem = v - 2 * k`由于皮划艇的尺寸为 1，因此我们最多可以携带`rem`皮划艇。 

我们也不能超过可用皮划艇的数量，因此：`take1 = min(rem, len(ones))`6. 计算该分割的总承载能力。 

总价值变为：`pref2[k] + pref1[take1]`将其与迄今为止看到的最佳答案进行比较。 
7. 存储最佳配置。 

节省：`best_twos = k`

`best_ones = take1`8.重构答案。 

输出以下指标：

 第一个`best_ones`皮划艇和

 第一个`best_twos`来自排序数组的双体船。 

### 为什么它有效

 正确性来自于交换论证。 

考虑任何最佳解决方案。 在所有已选择的皮划艇中，如果存在价值较大的未选择的皮划艇，则交换它们可以在不改变占用空间的情况下增加总承载能力。 因此，在最佳解决方案中，所选择的皮划艇必须是所有皮划艇中价值最高的皮划艇。 

同样的论点独立地适用于双体船。 

这意味着每个最佳解决方案仅由两个数字完全确定：

 选择了多少艘皮划艇以及多少艘双体船。 

一旦我们确定了双体船的数量，剩余容量就唯一地确定了皮划艇的最大可能数量。 然后，前缀总和给出该分割的最佳可实现值。 

由于我们尝试了每一种可行的双体船数量，因此其中一次迭代与最佳配置相匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, v = map(int, input().split())

ones = []
twos = []

for i in range(1, n + 1):
    t, p = map(int, input().split())

    if t == 1:
        ones.append((p, i))
    else:
        twos.append((p, i))

ones.sort(reverse=True)
twos.sort(reverse=True)

pref1 = [0]
for val, _ in ones:
    pref1.append(pref1[-1] + val)

pref2 = [0]
for val, _ in twos:
    pref2.append(pref2[-1] + val)

best = 0
best_ones = 0
best_twos = 0

for k in range(len(twos) + 1):
    used = 2 * k

    if used > v:
        break

    rem = v - used
    take1 = min(rem, len(ones))

    total = pref2[k] + pref1[take1]

    if total > best:
        best = total
        best_twos = k
        best_ones = take1

answer = []

for i in range(best_ones):
    answer.append(str(ones[i][1]))

for i in range(best_twos):
    answer.append(str(twos[i][1]))

print(best)
print(" ".join(answer))
```第一部分按类型区分船只，同时保留原始索引。 在排序过程中保留索引至关重要，因为输出需要原始输入顺序中的位置。 

对两个组进行降序排序可保证前缀对于固定计数始终是最佳的。 

前缀和数组是用额外的前导零构建的。 这使得表达式像`pref1[0]`自然有效并删除边界条件检查。 

主循环迭代所选双体船的数量。 由于每艘双体船消耗 2 个单位，因此占用体积为`2 * k`。 一旦超过这个值`v`，较大的值`k`也是不可能的，因此循环立即停止。 

表达式：```
take1 = min(rem, len(ones))
```是微妙的。 剩余容量可能大于可用皮划艇的数量。 忘记了`min`导致越界访问。 

重建阶段只是从排序数组中获取相应的前缀。 因为证明证明最优解总是使用前缀，所以这种重建与计算出的最优解完全匹配。 

Python 整数可以安全地处理这里的所有求和。 最大可能的总价值最多为`10^5 * 10^4 = 10^9`。 

## 工作示例

 ### 示例 1

 输入：```
3 2
1 2
2 7
1 3
```排序组：`ones = [(3, 3), (2, 1)]`

`twos = [(7, 2)]`前缀和：`pref1 = [0, 3, 5]`

`pref2 = [0, 7]`| k | 已用空间 | 剩余| 采取1 | 总计 |
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 2 | 2 | 5 |
 | 1 | 2 | 0 | 0 | 7 |

 最佳值为 7。 

所选指数：```
2
```这个痕迹说明了为什么盲目地最大化船只数量是错误的。 两艘皮划艇适合，但单艘双体船的总价值更大。 

### 示例 2

 输入：```
5 4
1 8
1 7
2 15
2 14
1 6
```排序组：`ones = [(8,1), (7,2), (6,5)]`

`twos = [(15,3), (14,4)]`前缀和：`pref1 = [0, 8, 15, 21]`

`pref2 = [0, 15, 29]`| k | 已用空间 | 剩余| 采取1 | 总计 |
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 4 | 3 | 21 | 21
 | 1 | 2 | 2 | 2 | 30|
 | 2 | 4 | 0 | 0 | 29 | 29

 最佳答案是30。 

所选船只：

 双体船 3 艘和皮划艇 1, 2 艘。 

此示例表明最佳解决方案可以混合这两种类型。 仅采用全球最强的类型是不够的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 排序主导运行时间 |
 | 空间| O(n) | 数组和前缀和存储所有船只 |

 和`n = 10^5`,`O(n log n)`在 Python 中很容易就足够快了。 内存使用量是线性的，可以轻松容纳在 64 MB 以内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    n, v = map(int, input().split())

    ones = []
    twos = []

    for i in range(1, n + 1):
        t, p = map(int, input().split())

        if t == 1:
            ones.append((p, i))
        else:
            twos.append((p, i))

    ones.sort(reverse=True)
    twos.sort(reverse=True)

    pref1 = [0]
    for val, _ in ones:
        pref1.append(pref1[-1] + val)

    pref2 = [0]
    for val, _ in twos:
        pref2.append(pref2[-1] + val)

    best = 0
    best_ones = 0
    best_twos = 0

    for k in range(len(twos) + 1):
        used = 2 * k

        if used > v:
            break

        rem = v - used
        take1 = min(rem, len(ones))

        total = pref2[k] + pref1[take1]

        if total > best:
            best = total
            best_twos = k
            best_ones = take1

    ans = []

    for i in range(best_ones):
        ans.append(str(ones[i][1]))

    for i in range(best_twos):
        ans.append(str(twos[i][1]))

    print(best)
    print(" ".join(ans))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    solve()

    sys.stdout = sys.__stdout__
    return out.getvalue()

# provided sample
assert run(
"""3 2
1 2
2 7
1 3
"""
).splitlines()[0] == "7", "sample 1"

# minimum case
assert run(
"""1 1
1 5
"""
).splitlines()[0] == "5", "single kayak"

# only catamarans fit
assert run(
"""3 2
2 10
2 20
1 1
"""
).splitlines()[0] == "20", "best catamaran"

# mixed optimal answer
assert run(
"""5 4
1 8
1 7
2 15
2 14
1 6
"""
).splitlines()[0] == "30", "mixed choice"

# equal values
assert run(
"""4 4
1 10
1 10
2 20
2 20
"""
).splitlines()[0] == "40", "multiple optimal answers"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单人皮划艇 | 5 | 最小尺寸输入 |
 | 坚固的双体船 | 20 | 选择一件 2 码的商品，而不是较弱的组合 |
 | 混合最优 | 30| 两种类型之间的正确互动 |
 | 同等价值| 40 | 40 多重最优解与稳定重构 |

 ## 边缘情况

 考虑前面反对按值贪婪的反例。 

输入：```
3 2
2 100
1 60
1 60
```排序组：`ones = [60, 60]`

`twos = [100]`该算法评估：

 对于`k = 0`:

 乘坐两艘皮划艇，总计 = 120

 对于`k = 1`:

 乘坐一艘双体船，总计 = 100

 该算法正确地选择了 120。首先选择最大单个值的天真的贪婪策略在这里会失败。 

现在考虑混合容量的情况。 

输入：```
4 3
2 100
2 99
1 60
1 50
```迭代次数为：

 对于`k = 0`:

 乘坐两艘皮划艇，总计 = 110

 对于`k = 1`:

 剩余空间 = 1

 乘坐一艘皮划艇，总计 = 160

 对于`k = 2`:

 占用空间=4，不可能

 该算法输出双体船的值为 100，皮划艇的值为 60。这证实了尝试每个可行数量的大小为 2 的项目可以正确处理奇数剩余容量。 

最后，考虑同等价值的物品。 

输入：```
5 4
1 10
1 10
2 20
2 20
1 10
```两艘双体船或四个皮划艇总价值单位的任意组合都会给出相同的答案。 该算法在保留索引的同时进行排序，并简单地输出一种有效的最佳前缀配置。 由于该问题接受任何最优集，因此这是正确的。
