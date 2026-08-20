---
title: "CF 102189C - 变更日志生成器"
description: "我们将几个游戏参数的旧值与补丁后的新值进行比较。 对于每个参数，旧值是 a[i]，新值是 b[i]。 整个更改根据每个参数的行为方式接收一个标签。"
date: "2026-08-19T16:08:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102189
codeforces_index: "C"
codeforces_contest_name: "12-\u0439 \u043e\u0442\u043a\u0440\u044b\u0442\u044b\u0439 \u0442\u0443\u0440\u043d\u0438\u0440 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e \u0432 \u0410\u0431\u0430\u043a\u0430\u043d\u0435"
rating: 0
weight: 102189
solve_time_s: 179
verified: true
draft: false
---

[CF 102189C - 变更日志生成器](https://codeforces.com/problemset/problem/102189/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们将几个游戏参数的旧值与补丁后的新值进行比较。 对于每个参数，旧值是`a[i]`新值是`b[i]`。 整个更改根据每个参数的行为方式接收一个标签。 

如果每对都相等，则结果为`Unchanged`。 如果没有减少参数，则结果为`Increased`，即使某些参数保持相同。 对称地，如果不增加参数，结果是`Reduced`。 如果至少一个参数增加并且至少一个参数减少，则结果为`Rescaled`。 

这些检查的顺序很重要。`Unchanged`满足两个条件`Increased`和条件`Reduced`，所以必须先认识它。 更一般地说，这四个类别完全取决于我们是否看到增加或减少。 

参数数量最多为 1000 个，因此即使线性扫描也只能执行大约一千次比较。 这些值可以大到`10^9`，但 Python 整数直接处理这些值，并且该算法从不执行可能变大的算术。 没有理由对数组进行排序、尝试组合或构建任何辅助结构。 

主要的边缘情况是所有值保持相等的数组。 例如，```
3
5 5 5
5 5 5
```产生`Unchanged`。 粗心的实施检查`b[i] >= a[i]`首先会错误地调用这个`Increased`，因为那里允许平等。`Unchanged`在单调分类之前必须进行检查。 

另一种边界情况是增加和等式的混合：```
3
5 7 9
5 8 9
```结果是`Increased`。 第一个和第三个参数不变，而第二个参数增加。 要求每个参数严格增加会错误地拒绝这种情况。 

减少也会出现同样的问题：```
3
9 7 5
9 6 5
```正确答案是`Reduced`，因为没有参数增加，只有一个参数减少。 严格比较例如`b[i] < a[i]`对于每个位置都会错误地拒绝它，因为两个位置没有改变。 

最后，一次增加和一次减少就足够了`Rescaled`:```
3
10 20 30
11 19 30
```第三个参数不变并不重要。 由于两个方向都发生，因此`Increased`也不`Reduced`是可能的。 

## 方法

 完全详尽的方法可以将每个参数视为具有四种可能的局部关系之一，例如未改变、增加、减少或其他状态，并在决定适合哪种全局分类之前枚举所有可能的组合。 和`n`参数，创建指数级的多种组合，最多`4^n`。 最大时`n = 1000`，这大约是`2^2000`，这远远超出了一秒程序可以处理的任何事情。 这种方法原则上是正确的，因为它考虑了本地更改的每个可能集合，但它探索了答案实际上并不依赖的信息。 

更合理的简单实现独立检查四个类别。 它可以扫描一次数组进行测试`Unchanged`,再次扫描测试`Increased`,再次扫描`Reduced`，最后决定`Rescaled`。 对于给定的约束来说，这已经足够快了，最多`4n = 4000`成对比较，因此在实际的朴素解决方案中不存在真正的性能问题。 

有用的观察是我们不需要知道变化的确切值。 我们只需要两个事实：是否有参数增加以及是否有参数减少。 扫描一对时`(a[i], b[i])`,`b[i] > a[i]`证明存在增加，同时`b[i] < a[i]`证明存在减少。 平等对这两个事实都没有贡献。 

这将整个分类减少为两个布尔属性。 如果两个属性都不出现，则所有值都相等。 如果只发生增加属性，则变化为`Increased`。 如果只出现递减性质，则`Reduced`。 如果两者都出现的话，就是`Rescaled`。 

因此，最佳实现执行一次并记录每个方向是否出现。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 详尽列举| O(4^n) | O(4^n) | O(n) | 太慢了|
 | 单独类别检查 | O(n) | O(n) | 已接受 |
 | 一次性分类 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 阅读`n`，然后是旧数组`a`和新数组`b`。 两个数组的长度相同，所以位置`i`始终比较补丁前后的相同参数。 
2.初始化两个布尔变量，`increased`和`reduced`， 到`False`。 它们代表我们是否至少遇到过一次严格增加或严格减少。 
3. 扫描每一对`(a[i], b[i])`。 如果`b[i] > a[i]`， 放`increased`到`True`。 如果`b[i] < a[i]`， 放`reduced`到`True`。 相等不会更改这两个标志，因为未更改的参数与两个单调分类兼容。 
4. 如果两个标志都是`False`， 打印`Unchanged`。 位置没有改变，所以这是唯一可能的分类。 
5.如果`increased`是`True`和`reduced`是`False`， 打印`Increased`。 每个参数要么保持不变，要么增加，这正是所需的条件。 
6. 如果`reduced`是`True`和`increased`是`False`， 打印`Reduced`。 每个参数要么保持不变，要么下降。 
7. 如果两个标志都是`True`， 打印`Rescaled`。 每个方向至少有一个参数移动，因此两种单调分类都不适用。 

不变量是在处理完第一个之后`k`参数，`increased`当至少其中之一时为真`k`参数增加，并且`reduced`当至少有一个减少时，这一点恰好成立。 处理下一对将精确更新可以更改的属性。 毕竟`n`对已经处理完毕，两个标志完全描述了全局行为，所以最终的分类不会错。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    increased = False
    reduced = False

    for x, y in zip(a, b):
        if y > x:
            increased = True
        elif y < x:
            reduced = True

    if not increased and not reduced:
        print("Unchanged")
    elif increased and not reduced:
        print("Increased")
    elif reduced and not increased:
        print("Reduced")
    else:
        print("Rescaled")

if __name__ == "__main__":
    solve()
```输入被读取为两个整数数组，因为每个位置`a`直接对应于相同位置`b`。 这个问题没有多个测试用例，所以`solve()`被调用一次。 

循环使用`zip(a, b)`无需手动管理索引即可比较相应的参数。 对于每一对，`if`和`elif`分支是互斥的。 相等的对不会执行任何一个分支，这正是我们所需要的。 

最终的四路决策检查两个标志。 先检查两者都为假的情况，这样区分`Unchanged`从`Increased`和`Reduced`。 不存在相差一的问题，因为`zip`精确处理两个数组的对应位置。 

除了比较之外不需要整数运算，因此`10^9`值绑定不会导致溢出问题。 数组本身需要 O(n) 内存，而分类状态仅使用两个额外的布尔值。 

## 工作示例

 考虑第一个样本：```
4
55 50 45 40
50 45 40 35
```每个新值都小于相应的旧值。 

| 参数| 旧| 新 | 增加 | 减少 |
 | --- | --- | --- | --- | --- |
 | 1 | 55 | 55 50 | 50 假 | 真实|
 | 2 | 50 | 50 45 | 45 假 | 真实|
 | 3 | 45 | 45 40 | 40 假 | 真实|
 | 4 | 40 | 40 35 | 35 假 | 真实|

 在最后，`increased`是假的并且`reduced`是真的，所以答案是`Reduced`。 该迹线表明，重复减少不需要进行计数。 一次减少就足以设置标志，额外的减少会使分类保持不变。 

现在考虑第二个示例：```
3
550 675 800
600 700 800
```前两个参数增加，最后一个参数保持不变。 

| 参数| 旧| 新 | 增加 | 减少 |
 | --- | --- | --- | --- | --- |
 | 1 | 550 | 550 600 | 真实| 假 |
 | 2 | 675 | 675 700 | 真实| 假 |
 | 3 | 800 | 800 | 真实| 假 |

 最终状态是`increased = True`和`reduced = False`，所以答案是`Increased`。 未更改的最后一个参数不会阻止结果`Increased`，因为定义允许参数保持不变。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个参数对都被检查一次。 |
 | 空间| O(n) | 两个输入数组包含`n`重视每一个； 分类本身使用 O(1) 额外空间。 |

 对于最多 1000 个参数，该算法仅执行线性数量的比较。 它完全在一秒的时间限制内，并且与 256 MB 的限制相比，使用的内存可以忽略不计。 

## 测试用例```python
import sys
import io

def classify(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    n = int(sys.stdin.readline())
    a = list(map(int, sys.stdin.readline().split()))
    b = list(map(int, sys.stdin.readline().split()))

    increased = False
    reduced = False

    for x, y in zip(a, b):
        if y > x:
            increased = True
        elif y < x:
            reduced = True

    if not increased and not reduced:
        print("Unchanged")
    elif increased and not reduced:
        print("Increased")
    elif reduced and not increased:
        print("Reduced")
    else:
        print("Rescaled")

    result = sys.stdout.getvalue().strip()

    sys.stdin = old_stdin
    sys.stdout = old_stdout
    return result

# Provided samples
assert classify("""\
4
55 50 45 40
50 45 40 35
""") == "Reduced", "sample 1"

assert classify("""\
3
550 675 800
600 700 800
""") == "Increased", "sample 2"

assert classify("""\
4
50 55 60 65
40 50 60 70
""") == "Rescaled", "sample 3"

assert classify("""\
3
1 2 3
1 2 3
""") == "Unchanged", "sample 4"

# Minimum size
assert classify("""\
1
0
0
""") == "Unchanged", "single unchanged parameter"

# Single strict increase at the boundary
assert classify("""\
1
0
1000000000
""") == "Increased", "maximum value increase"

# Single strict decrease at the boundary
assert classify("""\
1
1000000000
0
""") == "Reduced", "maximum value decrease"

# Increase, equality, and decrease together
assert classify("""\
3
0 500000000 1000000000
1 500000000 999999999
""") == "Rescaled", "both directions with equality in the middle"

# Maximum n, all equal
n = 1000
values = " ".join(["1000000000"] * n)
assert classify(f"{n}\n{values}\n{values}\n") == "Unchanged", \
    "maximum n with all values equal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 0 / 0`|`Unchanged`| 最小输入大小和相等性 |
 |`1 / 0 / 1000000000`|`Increased`| 单元增量与值边界 |
 |`1 / 1000000000 / 0`|`Reduced`| 单元素减少和值边界 |
 |`3 / 0 500000000 1000000000 / 1 500000000 999999999`|`Rescaled`| 两个方向加上不变的参数 |
 | 1000 个相等的值 |`Unchanged`| 最大限度`n`和完全平等的输入|

 ## 边缘情况

 对于所有平等的情况```
3
5 5 5
5 5 5
```每次比较都隐式采用相等分支，因此两个标志在整个扫描过程中都保持为假。 最终条件`not increased and not reduced`产生`Unchanged`。 这就是为什么检查`Unchanged`当使用这两个标志时，不需要通过显式的相等条件。 

对于与不变参数混合的增加，```
3
5 7 9
5 8 9
```第一对保持两个标志不变，第二对设置`increased`为 true，第三个没有任何改变。 自从`reduced`仍然为假，答案是`Increased`。 该算法并没有错误地要求更改每个参数。 

对于相应的约简情况，```
3
9 7 5
9 6 5
```第一组相等，第二组相等`reduced`为 true，第三个相等。 最终状态是`increased = False`,`reduced = True`, 给予`Reduced`。 

对于重新缩放，```
3
10 20 30
11 19 30
```第一对组`increased`，第二组`reduced`，第三个什么也不做。 一旦两个标志都为真，最终分类为`Rescaled`。 不变的第三个参数不能撤销任何一个事实，因为一个增加和一个减少的存在才是最重要的。 

最大值边界的行为与普通值相同。 为了```
1
0
1000000000
```比较`1000000000 > 0`套`increased`, 给予`Increased`。 对于反向输入，设置减少标志，结果为`Reduced`。 由于该解决方案仅比较整数，因此不需要对端点进行特殊处理`0`和`10^9`。
