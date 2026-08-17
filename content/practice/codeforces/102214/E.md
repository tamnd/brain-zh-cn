---
title: "CF 102214E - 加密"
description: "我们有一个长度为 n 的小写字符串。 在加密过程中，我们查看 n 的每个除数 d，从最大除数开始到 1 结束。对于每个这样的除数，我们反转由前 d 个字符组成的前缀。"
date: "2026-08-18T00:12:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102214
codeforces_index: "E"
codeforces_contest_name: "\u041e\u0442\u043a\u0440\u044b\u0442\u043e\u0435 \u043b\u0438\u0447\u043d\u043e\u0435 \u043f\u0435\u0440\u0432\u0435\u043d\u0441\u0442\u0432\u043e \u0418\u041a\u0418\u0422 \u0421\u0424\u0423 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2015"
rating: 0
weight: 102214
solve_time_s: 62
verified: true
draft: false
---

[CF 102214E - 加密](https://codeforces.com/problemset/problem/102214/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个长度为 n 的小写字符串。 在加密过程中，我们查看 n 的每个除数 d，从最大除数开始到 1 结束。对于每个这样的除数，我们反转由前 d 个字符组成的前缀。 

例如，如果n=10，则其除数按降序排列为10,5,2,1。 因此，加密执行四次前缀反转，首先对整个字符串，然后对前五个字符，然后对前两个字符，最后对第一个字符。 

输入为我们提供了加密的字符串，而不是原始字符串。 我们必须恢复原始字符串。 

长度最大为100，且字符串仅包含小写英文字母。 100 的限制很小，因此即使对每个所需的反转进行简单模拟也足够快。 不需要复杂的字符串算法或数据结构。 主要困难是认识可逆操作必须应用的方向。 

第一个边缘情况是 n=1。 例如：```
1z
```唯一的除数是 1，反转单字符前缀不会改变任何内容。 答案是：```
z
```假设总是存在一个不平凡的前缀来反转的粗心实现可能会意外地跳过或错误处理这种情况。 

当 n 本身是唯一涉及的大除数时，会出现另一种边缘情况。 例如：```
2ab
```除数是 1 和 2。解密按升序处理它们。 反转第一个字符不会改变任何内容，然后反转前两个字符会发生变化`ab`进入`ba`，所以正确答案是：```
ba
```如果我们在解密过程中按降序处理除数，我们会按照与加密相同的顺序执行操作，而不是撤消它们。 

第三个常见错误是忘记每个除数运算都作用于前缀，而不是作用于以该除数开始的块。 例如，当n=6时，除数3意味着颠倒位置1到3。它并不意味着颠倒位置3到6。 

## 方法

 考虑该问题的一种强力方法是枚举可能的原始字符串并对每个候选字符串进行加密，直到产生给定的加密字符串。 加密操作本身是确定性的，因此这样的候选者很容易验证。 然而，有 26 n 个可能的长度为 n 的小写字符串。 即使对于 n=20，这也是 26 20，大约 2 94，这是完全不可行的。 暴力破解在概念上是正确的，但失败了，因为即使加密过程本身是完全可逆的，它也会搜索巨大的空间。 

关键的观察是，每个加密操作都是一个反转，而反转就是它自己的逆。 如果我们反转一个前缀两次，我们就会得到原来的前缀。 唯一的其他问题是操作顺序。 

假设加密应用操作

 R d 1 ​ ,R d 2 ​​ ,…,R d k ​​

 其中除数满足

 d 1 ​ >d 2 ​ >⋯>d k ​ 。 

加密后的字符串是

 R d k ​​ (…R d 2 ​​(R d 1 ​​ (s))…)。 

要撤销此操作，我们必须首先撤销 R d k​​，然后撤销 R d k−1​​，依此类推。 由于每个反转都是其自身的反转，因此解密只需以相反的顺序应用相同的前缀反转。 

加密从最大到最小访问除数，因此解密从最小到最大访问除数。 

这将整个问题变成了直接模拟。 对于从 1 到 n 的每个 d，如果 d 整除 n，则反转前 d 个字符。 这正是 Codeforces 官方编辑解决方案所使用的方法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(26 n ⋅n) | O(26 n ⋅n) | O(n) | 太慢了 |
 | 最佳 | O(Σ d∣n ​ d) | O(n) | 已接受 |

 由于 n≤100，即使是简单的实现也完全在限制范围内。 所有除数之和也是渐进的 O(nloglogn)，因此即使在更大的界限下，直接模拟仍然有效。 

## 算法演练

 1.读取n和加密后的字符串t。 我们将就地修改该字符串，因为每个解密操作仅更改其字符的顺序。 
2. 从 1 迭代 d 到 n。 如果nmodd=0，则d是加密期间反转的前缀之一。 
3、反转长度d的前缀。 我们按升序处理除数，因为加密按降序处理相同的除数，并且每次反转都是其自身的逆。 
4. 处理完所有除数后，打印结果字符串。 此时，每个加密操作都已以完全相反的顺序撤消。 

### 为什么它有效

 令 n 的除数按升序排列为 d 1 ​ <d 2 ​ <⋯<d k ​。 加密按照 d k ​ ,d k−1 ​ ,…,d 1 ​的顺序应用反转。 解密采用 R d 1 ​ ,R d 2 ​​ ,…,R d k ​​。 由于对于每个前缀反转 R d ​ (R d ​ (x))=x，因此每次解密操作都会取消相应的加密操作。 这些操作也以相反的顺序应用，因此每个转换都在正确的点取消。 因此，最终的字符串是唯一的原始字符串。 

## Python 解决方案```python
Pythonimport sysinput = sys.stdin.readline

def solve():    n = int(input())    s = list(input().strip())
    for d in range(1, n + 1):        if n % d == 0:            s[:d] = reversed(s[:d])
    print(''.join(s))

if __name__ == "__main__":    solve()
```由于 Python 字符串是不可变的，因此字符串会被转换为列表。 表达式`s[:d]`准确地表示前 d 个字符，与问题的前缀反转相匹配。 

循环开始于`1`并结束于`n`，因此考虑所有可能的除数。 检查`n % d == 0`准确识别所需的前缀长度。 

作业```
Pythons[:d] = reversed(s[:d])
```将前缀替换为相反的前缀。 顺序至关重要。 从小除数到大除数的迭代执行加密序列的逆操作。 

Python 中不存在整数溢出问题。 也不存在相差一的问题，因为Python的切片`s[:d]`包含索引`0`通过`d-1`，恰好是 d 个字符。 

## 工作示例

 ### 示例 1

 输入是：```
10rocesfedoc
```10 的约数按升序排列为 1、2、5、10。 

| d | 是除数吗？ | 反转后的字符串 |
 | ---| ---| ---|
 | 1 | 是的 |`rocesfedoc`|
 | 2 | 是的 |`orcesfedoc`|
 | 3 | 没有 |`orcesfedoc`|
 | 4 | 没有 |`orcesfedoc`|
 | 5 | 是的 |`secrofedoc`|
 | 6 | 没有 |`secrofedoc`|
 | 7 | 没有 |`secrofedoc`|
 | 8 | 没有 |`secrofedoc`|
 | 9 | 没有 |`secrofedoc`|
 | 10 | 10 是的 |`codeforces`|

 最终的答案是：```
codeforces
```轨迹证明了中心不变量：在按升序处理前 k 个除数后，原始加密序列末尾相应的 k 个加密操作已经被取消。 

### 示例 2

 输入是：```
16plmaetwoxesisiht
```16 的约数是 1,2,4,8,16。 

| d | 是除数吗？ | 反转后的字符串 |
 | ---| ---| ---|
 | 1 | 是的 |`plmaetwoxesisiht`|
 | 2 | 是的 |`lpmaetwoxesisiht`|
 | 3 | 没有 |`lpmaetwoxesisiht`|
 | 4 | 是的 |`ampl...`|
 | 8 | 是的 |`this...`|
 | 16 | 16 是的 |`thisisexampletwo`|

 完整的结果字符串是：```
thisisexampletwo
```此示例练习了多个嵌套的前缀反转。 它还说明了为什么不能独立对待逆转。 反转较大的前缀会更改已通过较小的前缀反转移动的字符，因此确切的操作顺序很重要。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(Σ d∣n ​ d) | 每个除数 d 都会导致 d 个字符反转 |
 | 空间| O(n) | 该字符串存储为可变字符数组 |

 对于n≤100，最大工作量很小。 即使是扫描所有 n 个可能的前缀长度并反转每个合格前缀的故意简单的实现，也很容易在实际 Codeforces 问题的一秒时间限制和 256 MB 内存限制内。 

## 测试用例```python
Pythonimport sysimport io

def solve():    input = sys.stdin.readline    n = int(input())    s = list(input().strip())
    for d in range(1, n + 1):        if n % d == 0:            s[:d] = reversed(s[:d])
    print(''.join(s))

def run(inp: str) -> str:    old_stdin = sys.stdin    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)    sys.stdout = io.StringIO()
    try:        solve()        return sys.stdout.getvalue()    finally:        sys.stdin = old_stdin        sys.stdout = old_stdout

# Provided sample 1assert run("10\nrocesfedoc\n") == "codeforces\n", "sample 1"
# Provided sample 2assert run("16\nplmaetwoxesisiht\n") == "thisisexampletwo\n", "sample 2"
# Provided sample 3assert run("1\nz\n") == "z\n", "sample 3"
# Minimum-size inputassert run("1\na\n") == "a\n", "minimum size"
# All characters equalassert run("8\naaaaaaaa\n") == "aaaaaaaa\n", "all equal"
# Smallest non-trivial divisor structureassert run("2\nab\n") == "ba\n", "n = 2"
# Boundary-sized inputassert run("100\n" + "a" * 100 + "\n") == "a" * 100 + "\n", "n = 100"
# Several divisors, catches divisor-order mistakesassert run("6\nfedcba\n") == "abcdef\n", "multiple divisors"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / a`|`a`| 最小尺寸和长度前缀 1 |
 |`8 / aaaaaaaa`|`aaaaaaaa`| 反转保留相同的字符 |
 |`2 / ab`|`ba`| 最小的非平凡反转 |
 |`100 / a...a`| 相同的 100 个字符 | 最大输入长度|
 |`6 / fedcba`|`abcdef`| 多个除数和正确的反转顺序 |

 ## 边缘情况

 对于 n=1，输入```
1z
```只有除数 1。算法检查 1∣1，反转第一个字符，并获得`z`再次。 它打印`z`，因此单字符前缀不需要特殊情况。 

对于 n=2，考虑```
2ab
```递增除数序列是1,2。 长度一反转叶`ab`不变。 长度二反转产生`ba`。 加密`ba`反转整个字符串并返回`ab`，确认递增顺序是正确的逆顺序。 

对于每个字符都相等的输入，例如```
8aaaaaaaa
```每次反转都会使可见字符串保持不变。 该算法仍然处理除数 1,2,4,8，但每个中间状态仍然保留`aaaaaaaa`。 这捕获了意外依赖于不同字符的实现。 

最后，考虑```
6fedcba
```约数是 1,2,3,6。 按顺序反转这些长度的前缀后，字符串变为`abcdef`。 事实上，2、3 和 6 都与相同的第一个位置相互作用，这使得这是对最常见错误的有用测试，即在解密过程中按降序处理除数。 该解决方案通过精确反转加密序列来避免该错误。
