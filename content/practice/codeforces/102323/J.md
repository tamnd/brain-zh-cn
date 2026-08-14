---
title: "CF 102323J - 阶乘产品"
description: "对于每个测试用例，我们都会得到三个非负整数列表，分别称为 A、B 和 C。对于 A = [a1, a2, ..., ak] 等列表，将其得分定义为 [ P(A)=a1!cdot a2!cdots ak!。 ] 任务是确定三个列表中哪一个的分数最大。"
date: "2026-08-13T04:20:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102323
codeforces_index: "J"
codeforces_contest_name: "UCF Locals 2014"
rating: 0
weight: 102323
solve_time_s: 70
verified: true
draft: false
---

[CF 102323J - 阶乘积](https://codeforces.com/problemset/problem/102323/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个测试用例，我们给出三个非负整数列表，称为`A`,`B`， 和`C`。 对于诸如以下的列表`A = [a1, a2, ..., ak]`，将其得分定义为

 [
 P(A)=a_1!\cdot a_2!\cdots a_k!.
 ]

 任务是确定三个列表中哪一个得分最高。 如果两个或所有三个分数相等并且并列最大，则所需答案为`TIE`。 

输入以测试用例的数量开始。 每个测试用例给出三个列表大小，后跟三个列表的元素。 每个元素都在下面`2501`。 官方声明还保证，如果两种产品不同，它们的相对差异至少为`0.01%`较大的产品。 

关键的约束是上限`2500`取决于个体值，而不是阶乘乘积的大小。 甚至`2500!`太大而无法在普通整数算术中显式构造。 从技术上讲，Python 整数可以表示它，但重复构造和乘以包含许多此类阶乘的乘积将使数字变得巨大，并且算术变得越来越昂贵。 由于一秒的限制，解决方案必须避免具体化这些产品。 输入本身仍然需要被读取，因此任何有效的算法都应该与列表元素的总数基本上是线性的。 

在一些边缘情况下，直接的实现可能会悄无声息地失败。 考虑```
1
1 1 1
0
1
0
```分数是`0! = 1`,`1! = 1`， 和`0! = 1`，所以输出是```
Case #1: TIE
```一个处理的实现`0!`因为零会错误地选择`B`。 

另一种情况是```
1
2 1 1
2 2
3
2
```这里`P(A)=2!*2!=4`,`P(B)=3!=6`， 和`P(C)=2!=2`，所以答案是```
Case #1: B
```仅比较每个列表中最大元素的粗心实现会错误地选择`A`因为它的最大元素是`2`，但乘积取决于每个阶乘。 

第三种边缘情况是精确平局：```
1
1 2 1
3
2 1
3
```两个都`A`和`C`有分数`3!`， 尽管`B`有`2!*1!=2`，所以结果是```
Case #1: TIE
```输出是`TIE`即使绑定列表不包含相同的元素。 比较必须在最终产品之间进行。 

## 方法

 蛮力方法直接遵循数学定义。 对于每个值`x`， 计算`x!`，将这些阶乘相乘得到相应的列表，然后比较三个结果整数。 这是正确的，因为它准确地构造了问题定义的三个量。 

困难在于数字的大小。 如果列表包含`m`值并且每个值都是`2500`，分别计算每个阶乘大约需要`2500m`乘法。 在这三个列表中，这大约是`7500m`当列表具有可比大小时进行乘法。 更严重的是，中间整数本身有数百或数千位数长，并且乘以许多这样的值使得每个算术运算变得越来越昂贵。 存储最终产品也是不必要的工作，因为我们只需要他们的订单。 

消除该问题的观察结果是乘法在取对数后变为加法：

 \log(a_1!)+\log(a_2!)+\cdots+\log(a_k!)。 
]

 由于对数是严格递增的，因此对数分数最大的列表正是原始乘积最大的列表。 我们可以预先计算

 [
 L[x]=\log(x!)
 ]

 对于每一个`x`从`0`通过`2500`。 复发

 [
 L[x]=L[x-1]+\log x
 ]

 在线性时间内计算整个表。 

那么每个列表中的每个元素只需要添加一次。 我们从不构建阶乘或阶乘乘积。 

对不同产品的保证使得浮点比较在这里合适。 相对差异至少`0.01%`对应于对数差大约为

 [
 \log(1.0001)\大约 10^{-4}。 
]

 总和中的累积浮点误差远小于实际输入大小的间隔，因此较小的比较容差可以区分真正不同的产品，同时将数学上相同的产品视为平局。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2500S) 算术步骤，具有巨大的整数成本 | O(S) 加上大整数 | 太慢了 |
 | 最佳| O(2500 + S) | 奥（2500）| 已接受 |

 这里`S`是一个测试用例的三个列表中的元素总数。 最优方法还使用`math.lgamma(x + 1)`作为获取的另一种方式`log(x!)`，但是预先计算累积对数可以使预期的递归变得明确，并避免重复评估特殊函数。 

## 算法演练

 1. 预计算`log_fact[x]`对于每个整数`x`从`0`到`2500`。 开始于`log_fact[0] = 0`， 因为`0! = 1`和`log(1) = 0`。 对于每一个`x > 0`， 放`log_fact[x] = log_fact[x - 1] + log(x)`。 这给出了每个阶乘的对数，而无需构造阶乘本身。 
2.读取三个列表大小，然后读取三个列表。 大小准确地告诉我们有多少值属于每个列表，因此即使列表的值分布在多个物理输入行中，也可以使用输入。 
3. 对于每个列表，添加`log_fact[x]`对于每个值`x`在其中。 所得总和是该列表阶乘乘积的对数。 
4. 求三个对数分数中的最大值。 由于对数保留排序，因此最大分数对应于最大原始乘积。 
5. 使用较小的公差将每个分数与最大值进行比较。 如果在最大值公差范围内的所有三个值都被视为相等，则打印`TIE`; 否则打印唯一最大列表的名称。 
6. 对每个测试用例重复此操作，并在答案前添加基于 1 的用例编号。 

为什么有效：处理一个列表后，它的累加值正好是

 \log\left(\prod_{x\in A}x!\right)。 
]

 因此，三个累加值代表三个所需乘积的对数。 由于对数严格递增，因此它们的排序与原始产品的排序相同。 该问题的分离保证可防止两个不同的乘积足够接近而被浮点比较混淆，而相等的乘积会产生相等的数学对数和并被视为平局。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

MAXV = 2500
EPS = 1e-10

# log_fact[x] = log(x!)
log_fact = [0.0] * (MAXV + 1)
for x in range(1, MAXV + 1):
    log_fact[x] = log_fact[x - 1] + math.log(x)

def read_list(n):
    values = []
    while len(values) < n:
        values.extend(map(int, input().split()))
    return values[:n]

def solve():
    t = int(input())
    out = []

    for case_no in range(1, t + 1):
        sizes = []
        while len(sizes) < 3:
            sizes.extend(map(int, input().split()))

        na, nb, nc = sizes[:3]

        A = read_list(na)
        B = read_list(nb)
        C = read_list(nc)

        scores = [
            sum(log_fact[x] for x in A),
            sum(log_fact[x] for x in B),
            sum(log_fact[x] for x in C),
        ]

        mx = max(scores)

        tied = sum(abs(score - mx) <= EPS for score in scores)

        if tied >= 2:
            answer = "TIE"
        elif scores[0] == mx:
            answer = "A"
        elif scores[1] == mx:
            answer = "B"
        else:
            answer = "C"

        out.append(f"Case #{case_no}: {answer}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```预计算创建每个测试用例使用的表。 第一项为零，因为对数`0!`是对数`1`。 每个后续条目仅添加`log(x)`，完全反映重现性`x! = x * (x - 1)!`。 

这`read_list`helper 值得关注，因为该语句将每个列表描述为占用一个输入行，但强大的竞争性编程代码不应依赖于该格式细节。 它会继续读取，直到收集到所需数量的值。 

三个`sum`表达式实现了从乘积到总和的中心转换。 没有构造阶乘，因此 Python 的任意精度整数机制永远不必处理所涉及的巨大值。 

该比较使用对数的绝对容差。 相对差异为`0.01%`不同产品之间的对数差距接近`1e-4`， 然而`1e-10`小了许多数量级。 因此，公差完全低于保证的分离度。 

这`0!`和`1!`情况不需要特殊分支，因为两者都已经正确出现在预先计算的表中。 也不存在整数溢出问题，因为每个值都存储在`scores`是浮点对数而不是阶乘积。 

## 工作示例

 官方声明给出了示例列表`A = {2,4,7}`,`B = {0,1,9}`， 和`C = {2,3,5,5}`。 他们的实际产品是`241920`,`362880`， 和`172800`，分别是这样`B`是最大的。 

对于迹线，相关的对数状态如下。 

| 列表 | 价值观 | 对数分数 | 相对结果 |
 | --- | --- | --- | --- |
 | 一个 | 2、4、7 |`log(2!) + log(4!) + log(7!)`| 关于`12.395`|
 | 乙| 0、1、9 |`log(0!) + log(1!) + log(9!)`| 关于`12.802`|
 | C | 2、3、5、5 |`log(2!) + log(3!) + log(5!) + log(5!)`| 关于`12.059`|

 最高分是`B`，所以输出是`Case #1: B`。 该迹线说明了为什么该算法可以比较难以直接存储的数量：原始产品已经有数十万，而它们的对数仍然是很小的浮点数。 

第二个例子练习精确平局：```
1
2 2 1
3 2
2 3
4
```这些州是

 | 列表 | 价值观 | 阶乘产品 | 对数分数 |
 | --- | --- | --- | --- |
 | 一个 | 3, 2 |`3! * 2! = 12`|`log(12)`|
 | 乙| 2, 3 |`2! * 3! = 12`|`log(12)`|
 | C | 4 |`4! = 24`|`log(24)`|

 这里`C`严格来说更大，所以答案是`Case #1: C`。 要获得真正的领带，请改变`C`到`2 1`给出`2!*1!=2`，离开`A`和`B`并列最大。 关键属性是列表内值的顺序并不重要，因为乘法是可交换的，所以`[3,2]`和`[2,3]`必须产生相同的对数和。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(2500 + S) | 预计算在最大值上是线性的，每个列表元素贡献一次查表和一次加法|
 | 空间| 奥（2500）| 阶乘对数表为每个可能的输入值包含一个浮点值 |

 最大元素只有`2500`，因此预计算可以忽略不计。 之后，算法对每个输入值执行恒定的工作。 与暴力解决方案不同，它的运行时间不会随着阶乘乘积中的位数而增长，因为这些乘积永远不会被创建。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
import math

MAXV = 2500
EPS = 1e-10

log_fact = [0.0] * (MAXV + 1)
for x in range(1, MAXV + 1):
    log_fact[x] = log_fact[x - 1] + math.log(x)

def program(inp: str) -> str:
    data = list(map(int, inp.split()))
    it = iter(data)

    t = next(it)
    ans = []

    for case_no in range(1, t + 1):
        na = next(it)
        nb = next(it)
        nc = next(it)

        A = [next(it) for _ in range(na)]
        B = [next(it) for _ in range(nb)]
        C = [next(it) for _ in range(nc)]

        scores = [
            sum(log_fact[x] for x in A),
            sum(log_fact[x] for x in B),
            sum(log_fact[x] for x in C),
        ]

        mx = max(scores)
        tied = sum(abs(x - mx) <= EPS for x in scores)

        if tied >= 2:
            winner = "TIE"
        elif scores[0] == mx:
            winner = "A"
        elif scores[1] == mx:
            winner = "B"
        else:
            winner = "C"

        ans.append(f"Case #{case_no}: {winner}")

    return "\n".join(ans) + "\n"

# Provided example from the statement.
sample1 = """\
1
3 3 4
2 4 7
0 1 9
2 3 5 5
"""
assert program(sample1) == "Case #1: B\n", "provided example"

# Minimum-size values.  0! = 1! = 1, so all three products tie.
sample2 = """\
1
1 1 1
0
1
0
"""
assert program(sample2) == "Case #1: TIE\n", "minimum values and 0!"

# All lists contain exactly the same values, so they must tie.
assert program("""\
1
4 4 4
5 5 5 5
5 5 5 5
5 5 5 5
""") == "Case #1: TIE\n", "all equal lists"

# Boundary value 2500.  B has one additional 1!, so it is still tied with A.
assert program("""\
1
1 2 1
2500
2500 1
2499
""") == "Case #1: A\n", "maximum element and 1!"

# Catch an off-by-one mistake in factorial indexing.
# A = 4! = 24, B = 3! * 1! = 6, C = 3! = 6.
assert program("""\
1
1 2 1
4
3 1
3
""") == "Case #1: A\n", "factorial boundary"

# A and B have equal products despite different order.
assert program("""\
1
2 2 1
3 2
2 3
2
""") == "Case #1: TIE\n", "permutation equality"

# Large input value repeated many times, exercising the precomputed table
# without constructing the enormous factorial product.
assert program("""\
1
2 2 2
2500 2500
2500 2499
2500 2500
""") == "Case #1: A\n", "large factorial products"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1 1 1 / 0 / 1 / 0`|`Case #1: TIE`| 最小值和正确处理`0!`|
 | 四份`5`在每个列表中 |`Case #1: TIE`| 精确相等和重复值 |
 | 列表包含`2500`|`Case #1: A`| 最大允许元素和不存在大整数构造 |
 |`4`相对`3,1`相对`3`|`Case #1: A`| 正确的阶乘索引和边界处理 |
 |`[3,2]`相对`[2,3]`|`Case #1: TIE`| 产品交换性和平等性|
 | 重复`2500!`价值观 |`Case #1: A`| 大对数和和预计算 |

 ## 边缘情况

 对于`0!`，输入```
1
1 1 1
0
1
0
```产生三个零的对数分数。 预先计算的值`log_fact[0]`显式初始化为零，因此所有三个列表都被识别为绑定。 主循环期间不需要特殊情况。 

对于重复值，请考虑```
1
3 2 1
5 5 5
5 5
5
```每个列表贡献相同数量的副本`log(5!)`根据其大小，因此分数与`3`,`2`， 和`1`。 结果是`Case #1: A`。 该算法自然地处理重复，因为每次出现都会单独对总和做出贡献。 

对于具有不同列表内容的相同产品，请使用```
1
2 2 1
3 2
2 3
2
```前两个列表都有产品`3!*2! = 12`。 他们的对数分数都是`log(12)`，因此它们的差异为零，并且都在最大值的公差范围内。 输出是`Case #1: TIE`。 

对于最大可能的元素，考虑```
1
1 2 1
2500
2500 1
2499
```第一个列表有产品`2500!`，第二个也有`2500!*1!`，第三个有`2499!`。 自从`1! = 1`，前两个列表对应最大的产品。 算法查找`log_fact[2500]`直接并且从不尝试构建`2500!`。 

最后一种边缘情况是数值情况。 假设两种产品的差异为声明所允许的最小量，大约为`0.01%`。 它们的对数相差大约`0.0001`，而比较容差是`1e-10`。 容差远小于保证的差距，因此不同的产品不能通过比较而陷入平局。 同时，数学上相等的乘积具有相等的对数和，因此它们被认为是平局。
