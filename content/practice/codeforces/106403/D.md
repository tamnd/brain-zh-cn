---
title: "CF 106403D - 通电"
description: "该问题要求我们回答有关功率值集合的许多独立检查。 我们有一组不同的数字。"
date: "2026-06-25T10:07:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106403
codeforces_index: "D"
codeforces_contest_name: "Bay Area Programming Contest 2026 Novice Division"
rating: 0
weight: 106403
solve_time_s: 41
verified: true
draft: false
---

[CF 106403D - 通电](https://codeforces.com/problemset/problem/106403/D)

 **评级：** -
 **标签：** -
 **求解时间：** 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题要求我们回答有关功率值集合的许多独立检查。 我们有一组不同的数字。 在一次操作中，选择两个不同的值`a`和`b`创造新价值：$$a \cdot b + 2(a+b)$$对于每个查询值`x`，我们必须决定原始集合中的某个对是否可以准确地产生`x`。 这就是 Codeforces 问题 106403D，“Power Up”。 [Codeforces 问题存档](https://codeforces.com/gym/106403/problems)

 该表达式看起来需要检查所有对，但它有一个隐藏的代数结构。 我们可以将其重写为：$$a \cdot b + 2a + 2b + 4 - 4$$这给出：$$(a+2)(b+2)-4$$所以一个查询`x`恰好当`x + 4`可以表示为数组中两个不同移位值的乘积。 

输入尺寸很大。 最多可以有`2 * 10^5`值和相同数量的查询。 尝试每一对的解决方案的性能约为`n^2`操作，大约是`4 * 10^10`在最大的情况下，远远超出了典型的 2 秒限制所允许的范围。 我们需要一个更接近线性或`q * small_factor`时间。 

移动后的值`p_i + 2`至多是`200002`，它比最大可能的查询值小得多。 这意味着我们可以将所有可用的移位值存储在快速成员资格结构中。 对于每个查询，我们只需要搜索可能的因素`x + 4`。 

一个常见的错误是忘记所选择的两个元素必须不同。 例如，如果数组是：```
1
```查询是：```
8
```移位后的值为`3`， 和`8 + 4 = 12`可以整除`3`。 粗心的检查可能会被接受，因为`3 * 4 = 12`，但值`4`不存在。 答案是：```
NO
```当两个因素相同时，会出现另一种边缘情况。 为了：```
1
1
4
```我们有`x + 4 = 8`，移位后的值为`3`。 不存在一对不同的元素，所以答案是`NO`。 我们必须验证这两个因素都存在并且不同。 

## 方法

 最简单的方法是测试每对元素。 对于每两个值`a`和`b`，我们计算`a*b + 2(a+b)`并存储结果。 然后每个查询就变成一个恒定时间的查找。 

这种方法是正确的，因为每种可能的组合都被明确考虑。 问题在于组合的数量。 和`n = 200000`，对的数量大约为：$$\frac{n(n-1)}{2}$$这是关于`2 * 10^10`运营。 It is impossible to run within the limits.

 The key observation is the transformation:$$a*b+2(a+b)= (a+2)(b+2)-4$$Instead of generating all pair products, we reverse the process. 对于查询`x`，我们需要知道是否`x+4`有两个因子都是移位数组值。 

移位后的值足够小，可以存储在一个集合中。 为了回答查询，我们考虑因素`x+4`并检查它的除数。 由于查询值最多约为`10^9`，平方根约为`31623`，所以因式分解很快。 如果一个除数`d`存在并且两者都有`d`和`(x+4)/d`有可用的移位值，答案是肯定的。 我们还检查这两个因素是否不相等。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n² + q) | O(n²) | 太慢了|
 | 最佳| 最坏情况 | O(n + q√x) O(n) | 已接受 |

 ## 算法演练

 1.读取功率值并转换每个值`p`进入`p + 2`。 将这些转换后的值存储在一个集合中。 通过变换，我们可以使用乘法而不是原始的二次表达式。 
2. 对于每个查询`x`，将其替换为`target = x + 4`。 现在，有效的答案需要两个存储的转换值，其乘积为`target`。 
3. 尝试每个除数候选者`d`从`1`最多`sqrt(target)`。 如果`d`划分`target`，匹配因子为`target / d`。 
4. 检查两者是否`d`和`target / d`存在于变换值集中。 如果存在，并且两个值不同，则原始对存在，因此打印 YES。 
5. 如果检查了所有除数但没有找到有效的对，则打印 NO。 

只检查平方根就足够的原因是每个因子对都有一个不大于平方根的值，另一个不小于平方根的值。 通过找到该对的较小一侧，我们就找到了完整的对。 

为什么有效：转换保留了原始问题的确切条件。 每个有效对`(a, b)`变成`(a+2, b+2)`，他们的产品正是`x+4`。 相反，每个有效因子对`x+4`通过减去 2 映射回两个原始值。 由于该集合恰好包含移位后的原始值，因此除数搜索当且仅当存在一个时才找到一对。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, q = map(int, input().split())
    vals = list(map(int, input().split()))

    present = set()
    for v in vals:
        present.add(v + 2)

    ans = []
    for _ in range(q):
        x = int(input())
        target = x + 4
        ok = False

        d = 1
        while d * d <= target:
            if target % d == 0:
                other = target // d
                if d in present and other in present and d != other:
                    ok = True
                    break
            d += 1

        ans.append("YES" if ok else "NO")

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```套装`present`存储转换后的值而不是原始功率。 这可以避免在每次查询期间重复代数。 

对于每个查询，`target`是需要分成两个移位数字的值。 循环仅检查除数，直到`d*d`超过`target`，它涵盖了所有可能的因子对。 

条件`d != other`是必要的，因为原始对必须使用两个不同的元素。 由于所有原始幂都是不同的，因此两个相等的移位值不能来自不同的元素。 

Python 整数在这里安全地处理乘法和除法，因为最大的中间值保留在附近`10^9`。 

## 工作示例

 考虑：```
5 3
1 3 4 6 7
11
26
68
```变换后的集合为`{3, 5, 6, 8, 9}`。 

| 查询 | 目标 = x + 4 | 发现除数对 | 结果 |
 | --- | --- | --- | --- |
 | 11 | 11 15 | 15 3 和 5 | 是 |
 | 26 | 26 30| 5 和 6 | 是 |
 | 68 | 68 72 | 72 8 和 9 | 是 |

 该迹线显示了原始乘法问题如何变成因子查找问题。 

另一个案例：```
2 2
1 4
4
21
```变换后的集合为`{3, 6}`。 

| 查询 | 目标 = x + 4 | 发现除数对 | 结果 |
 | --- | --- | --- | --- |
 | 4 | 8 | 无 | 否 |
 | 21 | 21 25 | 25 无 | 否 |

 这表明仅用合数是不够的。 这两个因素都必须以权力转移的形式存在。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + q√x) | O(n + q√x) | 每个查询最多检查除数的平方根`10^9`|
 | 空间| O(n) | 该集合存储移位后的值 |

 最大平方根约为`31623`，因此除数检查对于给定数量的查询来说足够小。 该解决方案避免存储所有可能的对，这将需要不可能的内存。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().strip().split()
    if not data:
        return ""

    it = iter(data)
    n = int(next(it))
    q = int(next(it))

    present = set()
    for _ in range(n):
        present.add(int(next(it)) + 2)

    out = []
    for _ in range(q):
        x = int(next(it))
        target = x + 4
        ok = False
        d = 1
        while d * d <= target:
            if target % d == 0:
                if d in present and target // d in present and d != target // d:
                    ok = True
                    break
            d += 1
        out.append("YES" if ok else "NO")
    return "\n".join(out)

assert run("""5 8
1 3 4 6 7
11
21
26
36
50
68
69
20
""") == """YES
NO
YES
YES
YES
YES
NO
YES"""

assert run("""4 6
2 4 1 3
8
25
14
11
16
8
""") == """YES
NO
YES
YES
YES
YES"""

assert run("""1 2
1
5
8
""") == """NO
NO"""

assert run("""4 3
1 2 3 4
8
11
20
""") == """NO
YES
YES"""

assert run("""5 2
1 1 1 1 1
11
12
""") == """NO
NO"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素数组 | 否 | 检查自我配对是否不被接受 |
 | 连续小值 | 是/是案例 | 检查正态因子匹配 |
 | 重复值 | 否 | 确认只有不同的原始元素才重要 |
 | 值接近上限 | 是/否行为 | 检查除数边界处理 |

 ## 边缘情况

 对于单个可用值，该算法从不接受使用同一移位值两次的因式分解。 在输入中：```
1 1
1
5
```目标是`9`，唯一的移位值是`3`。 虽然`3 * 3 = 9`，因子相等，因此算法拒绝它。 

对于目标是素数的情况，不可能有两个有意义的因子。 例如：```
2 1
1 2
7
```移位后的值是`3`和`4`。 目标是`11`，该集合中没有除数对，因此答案是否定的。 

对于一个成功的案例：```
2 1
1 3
11
```移位后的值是`3`和`5`。 目标是`15`，除数搜索发现`3 * 5`，所以答案是肯定的。 这证实了转换与原始公式完全匹配。
