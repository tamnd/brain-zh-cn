---
title: "CF 102440H - 鲁布廖夫卡警察"
description: "我们有一个整数数组 (a1,dots,an)，其中每个元素描述了解决一项犯罪的难度。 Lesha 想要删除一个现有元素 (ap) 并插入两个新的整数值 (q) 和 (r)。 生成的数组有 (n+1) 个元素。"
date: "2026-08-09T13:34:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102440
codeforces_index: "H"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Junior"
rating: 0
weight: 102440
solve_time_s: 415
verified: true
draft: false
---

[CF 102440H - 来自鲁布廖夫卡的警察](https://codeforces.com/problemset/problem/102440/H)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个整数数组 (a_1,\dots,a_n)，其中每个元素描述了解决一项犯罪的难度。 Lesha 想要删除一个现有元素 (a_p) 并插入两个新的整数值 (q) 和 (r)。 生成的数组有 (n+1) 个元素。 

检查器不直接比较数组。 它仅比较它们的算术平均值和方差。 我们需要找到一个索引 (p) 和两个整数 (q,r)，以使两个统计数据保持完全相同。 如果不存在这样的修改，我们打印`Impossible`。 

让

 [
 S=\sum_{i=1}^n a_i
 ]

 和

 [
 Q=\sum_{i=1}^na_i^2。 
]

 原始均值是(m=S/n)，方差可以重写为

 [
 D=\frac{Q}{n}-m^2。 
]

 这种形式比扩展每个 ((a_i-m)^2) 有用得多，因为它减少了保留前两个幂和的问题。 

该数组最多包含 (10^5) 个元素，因此检查平方数对的算法不可行。 在大约一秒的竞赛限制下，预期的解决方案需要是线性的或接近线性的。 这些值本身以 (10^5) 为界，但最多 (10^5) 个这样的值的总和可以达到 (10^{10})，平方和可以达到 (10^{15})。 Python 整数可以安全地处理这些值，而固定宽度语言则需要 64 位整数。 

粗心的实施可能会错过一些边缘情况。 如果（n=1），唯一的元素总是可以被其自身的两个副本替换。 例如，对于`1 / 5`，正确答案是`Possible`，删除第一个元素并插入`5 5`。 假设数组至少有两个元素的方法可能会错误地拒绝它。 

第二个问题是非整数均值。 考虑```
2
0 1
```原始平均值为 (1/2)。 运算后有3个整数，所以它们的和是整数，而它们的均值不可能是(1/2)，因为三倍(1/2)不是整数。 因此答案是`Impossible`。 使用浮点和近似比较的解决方案可以很容易地掩盖这种完全不可能的情况。 

第三个问题是仅保留均值是不够的。 为了```
3
0 0 6
```均值是 (2)，但简单地选择两个整数，其总和补偿被删除的元素并不能保证方差能够保留。 第二个时刻也必须保留。 

最后，即使判别式是完全平方数，其奇偶性也很重要。 如果 (q+r=s) 且 (q-r=d)，则

 [
 q=\frac{s+d}{2},\qquad r=\frac{s-d}{2}。 
]

 仅当 (s) 和 (d) 具有相同奇偶校验时，两个值才是整数。 仅检查判别式是否是正方形是不够的。 

## 方法

 直接的暴力方法可以尝试每个位置 (p)，删除 (a_p)，然后枚举新元素之一的可能值。 一旦 (p) 和 (q) 固定，所需的 (r) 值就由平均值确定，因此可以通过重新计算这两个统计量来检查每个候选值。 这个想法是正确的，因为最终会考虑所有可能的替代方案。 

问题在于候选人的数量。 原始值的大小最多为 (10^5)，而替换值可能会稍大一些，因为新数组多了一个元素。 即使将搜索限制在 (10^5) 左右的安全区间，每个 (10^5) 个位置也会留下 (10^5) 个候选序列，或者大约 (10^{10}) 个检查。 在该循环内重新计算统计数据会使情况变得更糟。 

蛮力之所以有效，是因为统计数据施加了强大的代数限制，但它失败了，因为它没有足够早地利用它们。 关键的观察结果是均值相等立即固定总和 (q+r)，而方差相等与均值相等固定 (q^2+r^2)。 一旦总和和平方和已知，(q) 和 (r) 就是二次方程的两个根。 无需寻找它们。 

假设我们删除 (x=a_p)。 设原均值为(m)，并令

 [
 T=\frac{Q}{n}。 
]

 保留平均值给出

 [
 \frac{S-x+q+r}{n+1}=m。 
]

 由于 (S=nm)，这简化为

 [
 q+r=x+m。 
]

 因为 (x,q,r) 是整数，所以这已经告诉我们 (m) 必须是整数。 如果原始均值不是整数，则答案立即不可能。 

保留方差相当于保留第二个原始矩 (Q/n)，因为均值已经相等。 因此

 [
 \frac{Q-x^2+q^2+r^2}{n+1}=\frac{Q}{n},
 ]

 这给出了

 [
 q^2+r^2=x^2+\frac{Q}{n}。 
]

 所以(Q)也必须能被(n)整除，因为左边和(x^2)都是整数。 

现在让

 [
 s=q+r=x+m。 
]

 使用

 [
 (q-r)^2=2(q^2+r^2)-(q+r)^2,
 ]

 我们得到

 2\left(x^2+\frac Qn\right)-(x+m)^2。 
]

 对于每个可能删除的元素 (x)，可以在常数时间内计算出该值。 如果它是非负且完全平方数 (d^2)，并且 (d) 与 (x+m) 具有相同的奇偶性，则

 [
 q=\frac{x+m+d}{2},
 \qquad
 r=\frac{x+m-d}{2}
 ]

 是整数并形成有效的替换。 

因此，整个问题变成了对阵列的单次扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n\cdot V))，最坏情况下大约有 (10^{10}) 个候选 | (O(1)) | (O(1)) | 太慢了|
 | 最佳 | (O(n)) | (O(n)) | 输入数组的 (O(n)) | 已接受 |

 ## 算法演练

 1.读取数组并计算

 [
 S=\sum a_i,\qquad Q=\sum a_i^2。 
]

 这两个量就足够了，因为均值和方差都可以通过前两个幂和来表示。 

1. 检查(S)是否能被(n)整除。 如果不是，则打印`Impossible`。 

原因特别简单。 替换值是整数，因此 (q+r) 是整数。 从均值的保存来看，

 [
 q+r=x+\frac Sn。 
]

 由于(x)是整数，所以(S/n)也必须是整数。 

1. 设置

 [
 m=\frac Sn.
 ]

 然后检查(Q)是否能被(n)整除。 如果没有，则打印`Impossible`。 

对于任何移除的 (x)，

 [
 q^2+r^2=x^2+\frac Qn。 
]

 左边和(x^2)都是整数，所以(Q/n)一定是整数。 

1. 设置

 [
 T=\frac Qn.
 ]

 扫描每个数组元素 (x=a_i) 作为可能要删除的元素。 

1. 对于电流 (x)，计算

 [
 s=x+m
 ]

 和

 [
 d^2=2(x^2+T)-s^2。 
]

 值 (s) 由平均值强制确定。 值 (d^2) 由二阶矩强制。 

1、如果(d^2<0)，这个(x)就不能去掉。 否则计算整数平方根 (d=\lfloor\sqrt{d^2}\rfloor) 并检查是否 (d^2=d\cdot d)。 

负判别式意味着不存在实数值 (q,r)。 非平方判别式意味着两个根之间没有整数差。 

1. 检查(s)和(d)是否具有相同的奇偶性。 

如果没有，则公式

 [
 q=\frac{s+d}{2},\qquad r=\frac{s-d}{2}
 ]

 会产生半整数，这是被禁止的。 

1. 构建

 [
 q=\frac{s+d}{2},\qquad r=\frac{s-d}{2}
 ]

 并输出索引 (i+1)，后跟 (q,r)。 

(q) 和 (r) 的顺序并不重要，因为它们对称地贡献了两个所需的统计数据。 

1. 如果扫描完成后没有找到有效元素，则打印`Impossible`。 

### 为什么它有效

 对于每个候选 (x)，该算法根据均值相等导出唯一可能的和 (q+r)，并根据二阶矩相等导出唯一可能的值 (q^2+r^2)。 因此，任何有效对 (q,r) 都必须满足 ((q-r)^2) 的计算值。 平方和奇偶校验正是两个整数的和与差存在所需的条件。 因此，算法生成的每一对都保留了均值和方差。 相反，任何有效的替换都必须通过所有这些检查，因此扫描每个可能被删除的元素可以保证只要存在一个有效的解决方案即可找到。 

## Python 解决方案```python
import sys
import math

input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    total = sum(a)
    squares = sum(x * x for x in a)

    # The new mean is the old mean.
    # Since q + r and a[p] are integers, total / n must be integer.
    if total % n != 0:
        print("Impossible")
        return

    mean = total // n

    # q^2 + r^2 = a[p]^2 + squares / n,
    # so squares / n must also be integer.
    if squares % n != 0:
        print("Impossible")
        return

    second_moment = squares // n

    for i, x in enumerate(a):
        s = x + mean

        # d^2 = (q-r)^2
        d2 = 2 * (x * x + second_moment) - s * s

        if d2 < 0:
            continue

        d = math.isqrt(d2)

        if d * d != d2:
            continue

        if (s - d) % 2 != 0:
            continue

        q = (s + d) // 2
        r = (s - d) // 2

        print("Possible")
        print(i + 1, q, r)
        return

    print("Impossible")

if __name__ == "__main__":
    solve()
```前两个总和计算一次。 变量`total`表示第一个幂和，而`squares`代表第二次幂和。 两者都可能很大，因此计算是使用 Python 整数而不是浮点数完成的。 

可分性检查故意发生在主循环之前。 如果`total % n != 0`，没有删除的元素可以工作，因为每个候选都需要 (q+r=x+m)。 如果`squares % n != 0`，没有候选人可以工作，因为 (q^2+r^2=x^2+Q/n)。 

在循环内部，`s`是(q+r)的强制值。 表达式`d2`是 ((q-r)^2) 的强制值。 使用`math.isqrt`在检查潜在的大整数是否是完美平方时避免浮点精度问题。 

奇偶校验测试使用`(s - d) % 2`。 检查任一`s-d`或者`s+d`就足够了，因为它们具有相同的奇偶性。 检查成功后，整数除法会生成两个所需的替换值。 

输出索引为`i + 1`，因为 Python 数组是从零索引的，而问题是从一开始编号犯罪的。 

## 工作示例

 ### 示例 1

 输入是```
11
-5 -4 -3 -2 -1 0 1 2 3 4 5
```重要的全球价值观是

 [
 S=0,\qquad Q=110,
 ]

 所以

 [
 m=0，\qquad T=10。 
]

 扫描的行为如下。 

| 索引 | (x)| (s=x+m) | (d^2) | (d^2) | 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | -5 | -5 | 45 | 45 不是正方形 |
 | 2 | -4 | -4 | 36 | 36 有效，(d=6) |

 对于 (x=-4)，

 [
 q+r=-4
 ]

 和

 [
 q-r=6。 
]

 因此

 [
 q=1,\qquad r=-5。 
]

 将 (-4) 替换为 (1,-5) 即可获得结果数组。 它的和仍然是 (0)，它的平方和变成

 [
 110-16+1+25=120。 
]

 现在有 (12) 个元素，因此二阶矩为 (120/12=10)，正是原始值。 

因此输出是```
Possible
2 1 -5
```该迹证明了中心不变量：去除 (x) 后，新的和和新的平方和都完全确定。 

### 构造示例 2

 考虑```
1
5
```这里

 [
 S=5,\qquad Q=25,
 ]

 所以

 [
 m=5，\qquad T=25。 
]

 只有一个可能的元素需要删除。 

| 索引 | (x)| (s=x+m) | (d^2) | (d^2) | (d) | (q,r) |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 5 | 10 | 10 0 | 0 | 5, 5 |

 结果数组是`[5, 5]`。 其均值保持为 (5)，方差保持为零。 

输出可以是```
Possible
1 5 5
```本例运用 (n) 的最小值并确认判别式允许为零。 插入的两个值可以相同。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n)) | (O(n)) | 总和是一次性计算的，并且每个数组元素都测试一次。 |
 | 空间| (O(n)) | (O(n)) | 存储输入数组，以便可以检查所选犯罪值及其索引。 |

 对于 (n\le 10^5)，该算法仅对每个元素执行恒定数量的整数运算。 没有对替换值的嵌套搜索，也没有浮点计算，因此它完全符合预期的限制。 

## 测试用例

 有效解决方案的输出不是唯一的，因此下面的测试验证语义条件，而不是需要一个精确的有效三元组。 助手重建结果数组并检查其均值和方差是否与原始数组完全匹配。```python
import sys
import io
import math

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    n = int(sys.stdin.readline())
    a = list(map(int, sys.stdin.readline().split()))

    total = sum(a)
    squares = sum(x * x for x in a)

    if total % n != 0 or squares % n != 0:
        ans = "Impossible\n"
        sys.stdin = old_stdin
        return ans

    mean = total // n
    second_moment = squares // n

    for i, x in enumerate(a):
        s = x + mean
        d2 = 2 * (x * x + second_moment) - s * s

        if d2 < 0:
            continue

        d = math.isqrt(d2)

        if d * d != d2:
            continue

        if (s - d) % 2 != 0:
            continue

        q = (s + d) // 2
        r = (s - d) // 2

        ans = f"Possible\n{i + 1} {q} {r}\n"
        sys.stdin = old_stdin
        return ans

    sys.stdin = old_stdin
    return "Impossible\n"

def validate(inp: str, out: str) -> bool:
    lines = out.strip().splitlines()

    n, *rest = inp.strip().splitlines()
    n = int(n)
    a = list(map(int, rest[0].split()))

    if lines[0] == "Impossible":
        # Independently check whether any solution exists by using
        # the same necessary-and-sufficient conditions.
        total = sum(a)
        squares = sum(x * x for x in a)

        if total % n != 0 or squares % n != 0:
            return True

        mean = total // n
        second_moment = squares // n

        for x in a:
            s = x + mean
            d2 = 2 * (x * x + second_moment) - s * s

            if d2 < 0:
                continue

            d = math.isqrt(d2)

            if d * d == d2 and (s - d) % 2 == 0:
                return False

        return True

    if lines[0] != "Possible" or len(lines) != 2:
        return False

    p, q, r = map(int, lines[1].split())

    if not (1 <= p <= n):
        return False

    b = a[:p - 1] + [q, r] + a[p:]

    old_sum = sum(a)
    new_sum = sum(b)

    old_sq = sum(x * x for x in a)
    new_sq = sum(x * x for x in b)

    return (
        new_sum * n == old_sum * (n + 1)
        and new_sq * n == old_sq * (n + 1)
    )

# Provided sample
sample1 = """\
11
-5 -4 -3 -2 -1 0 1 2 3 4 5
"""
out = run(sample1)
assert validate(sample1, out), "sample 1"

# Minimum-size input
case2 = """\
1
5
"""
out = run(case2)
assert validate(case2, out), "minimum-size case"

# All values equal
case3 = """\
5
7 7 7 7 7
"""
out = run(case3)
assert validate(case3, out), "all-equal case"

# Non-integer mean, immediately impossible
case4 = """\
2
0 1
"""
out = run(case4)
assert out.strip() == "Impossible", "non-integer mean"

# Large boundary values
case5 = """\
100000
""" + " ".join(["100000"] * 100000) + "\n"
out = run(case5)
assert validate(case5, out), "maximum-size boundary case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`11`其次是`-5 ... 5`|`Possible`与任何有效的三元组 | 提供样本和判别推导|
 |`1 / 5`|`Possible`| 最小值 (n)，零判别 |
 | 五份`7`|`Possible`| 一切平等的价值观|
 |`2 / 0 1`|`Impossible`| 非整数原始平均值 |
 | (10^5) 份`100000`|`Possible`| 最大输入大小、大和和平方 |

 验证器有意避免比较确切的输出三元组。 此问题要求任何有效的替换，因此两个不同的答案都可以是正确的。 

## 边缘情况

 对于最小尺寸输入```
1
5
```该算法计算 (m=5) 和 (T=25)。 对于唯一可能的移除值 (x=5)，

 [
 s=10
 ]

 和

 [
 d^2=2(25+25)-100=0。 
]

 因此(d=0)，并且两个插入的值都是(5)。 输出是`Possible`，根据需要。 

对于非整数均值，例如```
2
0 1
```我们有 (S=1) 和 (n=2)，所以 (S\bmod n=1)。 该算法立即打印`Impossible`。 这比浮点比较更强，因为它证明没有整数 (q+r) 可以满足所需的平均值。 

对于全相等数组，例如```
5
7 7 7 7 7
```我们有 (m=7) 和 (T=49)。 删除任何 (x=7) 得到 (s=14) 和 (d^2=0)。 该算法插入 (7,7)，保持方差为零。 

完全平方检查是另一个关键边界。 在示例中，删除 (-4) 得到 (d^2=36)，因此 (d=6) 和根都是整数。 如果候选者生成 (d^2=35)，则即使判别式为正，两个根也不会是整数。 该算法拒绝它，因为`isqrt(35)`是 (5) 和 (5^2\ne35)。 

奇偶校验是一个单独的条件。 假设计算值为(s=5)和(d=2)。 二次根是

 [
 \frac{5+2}{2}=\frac72,\qquad
 \frac{5-2}{2}=\frac32,
 ]

 所以不存在整数替换。 该算法拒绝该候选，因为 (s-d=3) 是奇数。 

最大值也仍然是安全的。 对于 (10^5) 个元素，每个元素等于 (10^5)，

 [
 S=10^{10}
 ]

 和

 [
 Q=10^{15}。 
]

 两者都适合 Python 的任意精度整数。 更重要的是，该算法从不将完整方差构造为浮点数，因此在比较两个理论上相等的统计量时不会有精度损失。
